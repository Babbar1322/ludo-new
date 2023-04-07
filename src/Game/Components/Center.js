import React, {Component} from 'react';
import {View, Image} from 'react-native';
import {Constants} from '../Utils/positions';
import Center1 from '../Assets/Backgrounds/Center1.png';
import Center2 from '../Assets/Backgrounds/Center2.png';

export default class Center extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		const {game2} = this.props;
		return (
			<View
				style={{
					position: 'absolute',
					left: Constants.CELL_SIZE * 6,
					top: Constants.CELL_SIZE * 6,
					borderRadius: 10,
					overflow: 'hidden',
				}}>
				<Image
					source={game2 ? Center2 : Center1}
					style={{
						width: Constants.CELL_SIZE * 3,
						height: Constants.CELL_SIZE * 3,
					}}
				/>
			</View>
		);
	}
}
