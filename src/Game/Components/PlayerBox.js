// import React from 'react';
// import {View, Text, Image} from 'react-native';
// import AnimatedLottieView from 'lottie-react-native';
// import LinearGradient from 'react-native-linear-gradient';

// import Avatar1 from '../../Assets/Avatars/Avatar1.png';
// import Avatar2 from '../../Assets/Avatars/Avatar2.png';
// import Avatar3 from '../../Assets/Avatars/Avatar3.png';
// import Avatar4 from '../../Assets/Avatars/Avatar4.png';
// import Avatar5 from '../../Assets/Avatars/Avatar5.png';
// import Avatar6 from '../../Assets/Avatars/Avatar6.png';
// import Avatar7 from '../../Assets/Avatars/Avatar7.png';
// import Avatar8 from '../../Assets/Avatars/Avatar8.png';

// import styles from '../Styles/styles';
// import adjustFont from '../../Config/adjustFont';
// import {Constants} from '../Utils/positions';

// export default function PlayerBox({player, score, currentUser, diceNumber, turn}) {
// 	console.log('Player', player.color);
// 	const position = () => {
// 		switch (player.color) {
// 			case 'BLUE':
// 				return [0, Constants.CELL_SIZE * 9];
// 			case 'GREEN':
// 				return [Constants.CELL_SIZE * 9, 0];
// 			case 'RED':
// 				return [0, 0];
// 			case 'YELLOW':
// 				return [Constants.CELL_SIZE * 9, Constants.CELL_SIZE * 9];
// 		}
// 	};

// 	const renderImage = () => {
// 		switch (player.player?.avatar) {
// 			case 'Avatar1':
// 				return Avatar1;
// 			case 'Avatar2':
// 				return Avatar2;
// 			case 'Avatar3':
// 				return Avatar3;
// 			case 'Avatar4':
// 				return Avatar4;
// 			case 'Avatar5':
// 				return Avatar5;
// 			case 'Avatar6':
// 				return Avatar6;
// 			case 'Avatar7':
// 				return Avatar7;
// 			case 'Avatar8':
// 				return Avatar8;
// 			default:
// 				return null;
// 		}
// 	};

// 	const renderBackgroundColor = () => {
// 		switch (player.color) {
// 			case 'RED':
// 				return ['#FF1723', '#890000'];
// 			case 'GREEN':
// 				return ['#23CE1E', '#0B762E'];
// 			case 'BLUE':
// 				return ['#17B5FE', '#0056C3'];
// 			case 'YELLOW':
// 				return ['#FFE20C', '#C37801'];
// 		}
// 	};

// 	const darkBackground = () => {
// 		switch (player.color) {
// 			case 'RED':
// 				return '#810E09';
// 			case 'GREEN':
// 				return '#015404';
// 			case 'BLUE':
// 				return '#000A47';
// 			case 'YELLOW':
// 				return '#895B00';
// 		}
// 	};

// 	const [x, y] = position();
// 	return (
// 		<View
// 			style={[
// 				styles.playerBoxContainer,
// 				{
// 					backgroundColor: darkBackground(),
// 					width: 6 * Constants.CELL_SIZE,
// 					height: 6 * Constants.CELL_SIZE,
// 					position: 'absolute',
// 					left: x,
// 					top: y,
// 					borderRadius: 20,
// 					overflow: 'hidden',
// 				},
// 			]}>
// 			<LinearGradient colors={renderBackgroundColor()} style={styles.gradientContainer}>
// 				{turn === player.color && turn !== currentUser && (
// 					<View
// 						style={{
// 							position: 'absolute',
// 							top: '5%',
// 							right: '5%',
// 						}}>
// 						{Boolean(diceNumber) && <Text style={{color: '#fff', fontFamily: 'DailyHours', fontSize: adjustFont(50)}}>{diceNumber}</Text>}
// 					</View>
// 				)}
// 				{player.color === turn && <AnimatedLottieView source={require('../Assets/Lotties/Expanding.json')} style={styles.lottie} autoPlay loop />}
// 				<View style={{bottom: 0, position: 'absolute', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', width: '90%'}}>
// 					<Image source={renderImage()} style={styles.inGameAvatar} />
// 					<Text style={{color: '#fff', fontFamily: 'DailyHours', fontSize: 30, textAlign: 'right'}}>{Boolean(score) && score}</Text>
// 				</View>
// 			</LinearGradient>
// 			<View style={{paddingHorizontal: '3%', paddingVertical: '1%'}}>
// 				<Text style={{color: '#fff', fontSize: adjustFont(9), textAlign: 'center'}}>{player.player?.name}</Text>
// 			</View>
// 		</View>
// 	);
// }

import React, {Component} from 'react';
import {View, Text, Image} from 'react-native';
import AnimatedLottieView from 'lottie-react-native';
import LinearGradient from 'react-native-linear-gradient';

import Avatar1 from '../../Assets/Avatars/Avatar1.png';
import Avatar2 from '../../Assets/Avatars/Avatar2.png';
import Avatar3 from '../../Assets/Avatars/Avatar3.png';
import Avatar4 from '../../Assets/Avatars/Avatar4.png';
import Avatar5 from '../../Assets/Avatars/Avatar5.png';
import Avatar6 from '../../Assets/Avatars/Avatar6.png';
import Avatar7 from '../../Assets/Avatars/Avatar7.png';
import Avatar8 from '../../Assets/Avatars/Avatar8.png';

import styles from '../Styles/styles';
import adjustFont from '../../Config/adjustFont';
import {Constants} from '../Utils/positions';
import {BLUE, GREEN, RED, YELLOW} from '../Utils/constants';

export default class PlayerBox extends Component {
	shouldComponentUpdate(nextProps) {
		const {score, diceNumber, turn, player, currentUser} = this.props;
		// console.log(diceNumber, 'dicenumber', player.color, currentUser);
		return Boolean(nextProps.turn !== turn || nextProps.score !== score || nextProps.diceNumber !== diceNumber);
	}

	position = () => {
		// console.log(this.props.game2, 'Game2 -- Player', this.props.player.color);
		if (this.props.game2) {
			switch (this.props.player.color) {
				case GREEN:
					return [0, Constants.CELL_SIZE * 9];
				case BLUE:
					return [Constants.CELL_SIZE * 9, 0];
				case RED:
					return [0, 0];
				case YELLOW:
					return [Constants.CELL_SIZE * 9, Constants.CELL_SIZE * 9];
			}
		} else {
			switch (this.props.player.color) {
				case BLUE:
					return [0, Constants.CELL_SIZE * 9];
				case GREEN:
					return [Constants.CELL_SIZE * 9, 0];
				case RED:
					return [0, 0];
				case YELLOW:
					return [Constants.CELL_SIZE * 9, Constants.CELL_SIZE * 9];
			}
		}
	};

	renderImage = () => {
		switch (this.props.player.player?.avatar) {
			case 'Avatar1':
				return Avatar1;
			case 'Avatar2':
				return Avatar2;
			case 'Avatar3':
				return Avatar3;
			case 'Avatar4':
				return Avatar4;
			case 'Avatar5':
				return Avatar5;
			case 'Avatar6':
				return Avatar6;
			case 'Avatar7':
				return Avatar7;
			case 'Avatar8':
				return Avatar8;
			default:
				return null;
		}
	};

	renderBackgroundColor = () => {
		switch (this.props.player.color) {
			case RED:
				return ['#FF1723', '#890000'];
			case GREEN:
				return ['#23CE1E', '#0B762E'];
			case BLUE:
				return ['#17B5FE', '#0056C3'];
			case YELLOW:
				return ['#FFE20C', '#C37801'];
		}
	};

	darkBackground = () => {
		switch (this.props.player.color) {
			case RED:
				return '#810E09';
			case GREEN:
				return '#015404';
			case BLUE:
				return '#000A47';
			case YELLOW:
				return '#895B00';
		}
	};

	render() {
		const {player, score, currentUser, diceNumber, turn} = this.props;
		const [x, y] = this.position();
		// console.log(turn, currentUser, player.color);
		// console.log(turn === player.color && turn !== currentUser);
		return (
			<View
				style={[
					styles.playerBoxContainer,
					{
						backgroundColor: this.darkBackground(),
						width: 6 * Constants.CELL_SIZE,
						height: 6 * Constants.CELL_SIZE,
						position: 'absolute',
						left: x,
						top: y,
						borderRadius: 20,
						overflow: 'hidden',
					},
				]}>
				<LinearGradient colors={this.renderBackgroundColor()} style={styles.gradientContainer}>
					{turn === player.color && turn !== currentUser && (
						<View
							style={{
								position: 'absolute',
								top: '5%',
								right: '5%',
							}}>
							{<Text style={{color: '#fff', fontFamily: 'DailyHours', fontSize: adjustFont(50)}}>{diceNumber}</Text>}
						</View>
					)}
					{player.color === turn && <AnimatedLottieView source={require('../Assets/Lotties/Expanding.json')} style={styles.lottie} autoPlay loop />}
					<View style={{bottom: 0, position: 'absolute', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', width: '90%'}}>
						<Image source={this.renderImage()} style={styles.inGameAvatar} />
						<Text style={{color: '#fff', fontFamily: 'DailyHours', fontSize: 30, textAlign: 'right'}}>{Boolean(score) && score}</Text>
					</View>
				</LinearGradient>
				<View style={{paddingHorizontal: '3%', paddingVertical: '1%'}}>
					<Text style={{color: '#fff', fontSize: adjustFont(9), textAlign: 'center'}}>{player.player?.name}</Text>
				</View>
			</View>
		);
	}
}
