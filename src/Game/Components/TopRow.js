import React, {Component} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {Icon} from 'react-native-elements';
import styles from '../Styles/styles';
import {SW} from '../Utils/constants';

export default class TopRow extends Component {
	shouldComponentUpdate(nextProps) {
		const {ping} = this.props;
		return nextProps.ping !== ping;
	}
	getPingColor() {
		const {ping} = this.props;
		switch (true) {
			case ping > 1000:
				return '#fa3c3c';
			case ping > 700:
				return '#fa953c';
			case ping > 400:
				return '#faf03c';
			case ping > 0:
				return '#4ffa3c';
			default:
				return '#fff';
		}
	}
	render() {
		// console.log('Rendered TopRow');
		return (
			<View style={styles.topRow}>
				<View style={styles.buttonContainer}>
					<Text style={{color: '#fff'}}>Prize: {this.props.bet}</Text>
				</View>
				<View style={styles.buttonContainer}>
					<Text style={{color: '#fff'}}>{this.props.gameId}</Text>
				</View>
				<TouchableOpacity activeOpacity={0.7} onPress={this.props.openSettings} style={styles.buttonContainer}>
					<Icon name="gear" type="evilicon" color={'#fff'} />
				</TouchableOpacity>
				<View
					style={[
						styles.buttonContainer,
						{
							flexDirection: 'row',
							alignItems: 'center',
							position: 'absolute',
							top: '120%',
							right: '5%',
							paddingHorizontal: 7,
							paddingVertical: 4,
							borderColor: this.getPingColor,
						},
					]}>
					<Icon
						name={
							this.props.ping > 1000
								? 'wifi-strength-1'
								: this.props.ping > 700
								? 'wifi-strength-2'
								: this.props.ping > 400
								? 'wifi-strength-3'
								: this.props.ping > 0
								? 'wifi-strength-4'
								: undefined
						}
						color={this.getPingColor()}
						type="material-community"
						size={20}
					/>
					<Text
						style={{
							color: this.getPingColor(),
							maxWidth: SW / 4,
						}}
						numberOfLines={1}>
						{this.props.ping}ms
					</Text>
				</View>
			</View>
		);
	}
}
