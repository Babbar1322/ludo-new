import React, {Component} from 'react';
import {View, Text} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Constants} from '../Utils/positions';

class LudoPlayer extends Component {
	constructor(props) {
		super(props);
	}

	getBackgroundColor() {
		switch (this.props.color) {
			case 'red':
				return ['#FF1723', '#890000'];
			case 'green':
				return ['#23CE1E', '#0B762E'];
			case 'blue':
				return ['#17B5FE', '#0056C3'];
			case 'yellow':
				return ['#FFE20C', '#C37801'];
		}
	}
	render() {
		// console.log(this.props);
		const {color} = this.props;
		const x = this.props.positions[0];
		const y = this.props.positions[1];

		return (
			<>
				<View
					style={{
						backgroundColor: color,
						width: 6 * Constants.CELL_SIZE,
						height: 6 * Constants.CELL_SIZE,
						position: 'absolute',
						left: x,
						top: y,
						borderRadius: 20,
						overflow: 'hidden',
					}}>
					<LinearGradient colors={this.getBackgroundColor()} style={{flex: 1}} />
					{/* <Text>Gursahb Singh</Text> */}
				</View>
				{/* {pieces.home.map((piece, index) => (
					<LudoPiece key={index} position={piece.position} color={color} />
				))}
				{pieces.start.map((piece, index) => (
					<LudoPiece key={index} position={piece.position} color={color} />
				))}
				{pieces.end.map((position, index) => (
					<LudoPiece key={index} position={position} color={color} />
				))} */}
			</>
		);
	}
}

export default LudoPlayer;
