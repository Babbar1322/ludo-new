import React, {Component} from 'react';
import {Animated, TouchableOpacity, Image, Easing} from 'react-native';
import Sound from 'react-native-sound';
import {View as AnimatableView} from 'react-native-animatable';

import BluePiece from '../Assets/Pawns/BluePawn.png';
import GreenPiece from '../Assets/Pawns/GreenPawn.png';
import RedPiece from '../Assets/Pawns/RedPawn.png';
import YellowPiece from '../Assets/Pawns/YellowPawn.png';

const stepAudio = new Sound('step.wav', Sound.MAIN_BUNDLE);
stepAudio.setVolume(0.5);

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
		const {position} = this.props;
		this.animate(position);
	}

	componentDidUpdate(prevProps) {
		const {position} = this.props;
		if (prevProps.position[0] !== position[0] || prevProps.position[1] !== position[1]) {
			this.animate(position);
			stepAudio.play();
		}
	}

	shouldComponentUpdate(nextProps) {
		const {position, animateForSelection} = this.props;
		return nextProps.position[0] !== position[0] || nextProps.position[1] !== position[1] || nextProps.animateForSelection !== animateForSelection;
	}

	animate(position) {
		const right = this.props.color === this.props.currentUser ? 3 : -3;
		Animated.timing(this.animation, {
			toValue: {x: position[0] + right, y: position[1]},
			duration: 130,
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

	render() {
		// console.log(this.props);
		const {size, onTouch, animateForSelection, currentUser, color} = this.props;
		return (
			<Animated.View
				style={{
					position: 'absolute',
					transform: [{translateX: this.animation.x}, {translateY: this.animation.y}],
					zIndex: color === currentUser ? 4 : 1,
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
								width: size + 10,
								height: size + 10,
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
							width: size / 1.1,
							height: size / 1.1,
							position: 'absolute',
							borderWidth: 4,
							borderColor: '#000',
							borderStyle: 'dotted',
							borderRadius: size,
							bottom: '-10%',
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
