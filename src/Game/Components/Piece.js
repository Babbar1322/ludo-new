import React, {Component} from 'react';
import {Animated, TouchableOpacity, Image, Easing} from 'react-native';
import {View as AnimatableView} from 'react-native-animatable';

import BluePiece from '../Assets/Pawns/BluePawn.png';
import GreenPiece from '../Assets/Pawns/GreenPawn.png';
import RedPiece from '../Assets/Pawns/RedPawn.png';
import YellowPiece from '../Assets/Pawns/YellowPawn.png';
import {Constants} from '../Utils/positions';

// import {StepAudio} from './Sounds';

const rotate = {
	from: {
		transform: [{rotate: '0deg'}],
	},
	to: {
		transform: [{rotate: '360deg'}],
	},
};

class Piece extends Component {
	constructor(props) {
		super(props);
	}
	animation = new Animated.ValueXY();

	componentDidMount() {
		// const {position} = this.props;
		this.animate(this.getPosition());
	}

	componentDidUpdate(prevProps) {
		const {position} = this.props;
		if (prevProps.position[0] !== position[0] || prevProps.position[1] !== position[1]) {
			this.animate(this.getPosition());
			// StepAudio.play();
		}
	}

	shouldComponentUpdate(nextProps) {
		const {position, animateForSelection} = this.props;
		return nextProps.position[0] !== position[0] || nextProps.position[1] !== position[1] || nextProps.animateForSelection !== animateForSelection;
	}

	animate(position) {
		// const right = this.props.color === this.props.currentUser ? 3 : -3;
		Animated.timing(this.animation, {
			toValue: {x: position[0], y: position[1]},
			duration: 150,
			useNativeDriver: true,
			easing: Easing.inOut(Easing.ease),
		}).start();
	}

	getPieceColor() {
		const {color} = this.props;
		switch (color) {
			case 'blue':
				return BluePiece;
			case 'green':
				return GreenPiece;
			case 'red':
				return RedPiece;
			case 'yellow':
				return YellowPiece;
			default:
				return null;
		}
	}

	getSize() {
		const {size, position, animateForSelection} = this.props;
		if (animateForSelection) {
			return Constants.CELL_SIZE + 3;
		}
		if (position[2] === 'B6' || position[2] === 'G6') {
			return size - 10;
		}
		return size;
	}

	getPosition() {
		const {position, color, name, currentUser, animateForSelection} = this.props;
		if (currentUser === 'blue') {
			if (color === 'blue' && position[2] === 'B6') {
				switch (name) {
					case 1:
						console.log(position);
						return [position[0] + 6, position[1] - 2];
					case 2:
						return [position[0] - 10, position[1] + 10];
					case 3:
						return [position[0] + 6, position[1] + 10];
					case 4:
						return [position[0] + 22, position[1] + 10];
				}
			}
			if (color === 'green' && position[2] === 'G6') {
				switch (name) {
					case 1:
						return [position[0] + 6, position[1] + 12];
					case 2:
						return [position[0] - 10, position[1] - 2];
					case 3:
						return [position[0] + 6, position[1] - 2];
					case 4:
						return [position[0] + 22, position[1] - 2];
				}
			}
			if (animateForSelection) {
				return [position[0] - 2, position[1] - 6];
			} else {
				return [position[0], position[1]];
			}
			// return position;
		} else {
			if (color === 'blue' && position[2] === 'B6') {
				switch (name) {
					case 1:
						return [position[0] + 6, position[1] + 12];
					case 2:
						return [position[0] - 10, position[1] - 2];
					case 3:
						return [position[0] + 6, position[1] - 2];
					case 4:
						return [position[0] + 22, position[1] - 2];
				}
			}
			if (color === 'green' && position[2] === 'G6') {
				switch (name) {
					case 1:
						return [position[0] + 6, position[1] - 2];
					case 2:
						return [position[0] - 10, position[1] + 10];
					case 3:
						return [position[0] + 6, position[1] + 10];
					case 4:
						return [position[0] + 22, position[1] + 10];
				}
			}
			if (animateForSelection) {
				return [position[0] - 2, position[1] - 6];
			} else {
				return [position[0], position[1]];
			}
			// return position;
		}
	}

	render() {
		// console.log(this.props);
		const {onTouch, animateForSelection, currentUser, color} = this.props;
		return (
			<Animated.View
				style={{
					position: 'absolute',
					transform: [{translateX: this.animation.x}, {translateY: this.animation.y}],
					zIndex: color === currentUser ? 4 : 1,
					marginTop: animateForSelection ? '-0.5%' : 0,
				}}>
				<TouchableOpacity
					activeOpacity={0.8}
					onPressIn={onTouch}
					style={{
						zIndex: 1,
					}}>
					<Image
						source={this.getPieceColor()}
						style={[
							{
								width: this.getSize() + 10,
								height: this.getSize() + 10,
								resizeMode: 'contain',
							},
						]}
					/>
				</TouchableOpacity>
				{animateForSelection && (
					<AnimatableView
						animation={rotate}
						easing="linear"
						iterationCount="infinite"
						duration={1200}
						style={{
							width: this.getSize() / 1.1,
							height: this.getSize() / 1.1,
							position: 'absolute',
							borderWidth: 4,
							borderColor: '#000',
							borderStyle: 'dotted',
							borderRadius: this.getSize(),
							bottom: '-9%',
							right: '18%',
							zIndex: 0,
						}}
					/>
				)}
			</Animated.View>
		);
	}
}

export default Piece;
