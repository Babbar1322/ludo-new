import React from 'react';
import {Alert, StatusBar, Text, ToastAndroid, View, ImageBackground, BackHandler, TouchableOpacity, Vibration, AppState} from 'react-native';
import io from 'socket.io-client';
import {Button, IconButton} from 'react-native-paper';
import {BLUE, BOTTOM_VERTICAL, FINISHED, FOUR, GREEN, ONE, P22, P35, P48, P9, RED, SOCKET_API, THREE, TOP_VERTICAL, TWO, YELLOW} from '../Game/Utils/constants';
import {c} from '../Game/Utils/colors';
import styles from '../Game/Styles/styles';
import Popup from '../Components/Popup';
import PlayerBox from '../Game/Components/PlayerBox';
import Dice from '../Game/Components/Dice';
import HorizontalCellsContainer from '../Game/Components/HorizontalCellsContainer';
import VerticalCellsContainer from '../Game/Components/VerticalCellsContainer';
import NetInfo from '@react-native-community/netinfo';

import BG from '../Game/Assets/Backgrounds/GridBG.png';
import Sound from 'react-native-sound';
import {Icon} from 'react-native-elements';
import {SW} from '../Config/Config';
const socket = io(SOCKET_API, {
	reconnection: true,
	reconnectionDelay: 2000,
	reconnectionAttempts: 20,
	reconnectionDelayMax: 5000,
	autoConnect: true,
});
socket.timeout = 2000;

const stepAudio = new Sound('step.wav', Sound.MAIN_BUNDLE);
const diceAudio = new Sound('dice.mp3', Sound.MAIN_BUNDLE);
const safeAudio = new Sound('safe.wav', Sound.MAIN_BUNDLE);
const cutAudio = new Sound('cut.wav', Sound.MAIN_BUNDLE);
const finishAudio = new Sound('finish.wav', Sound.MAIN_BUNDLE);
const winAudio = new Sound('win.wav', Sound.MAIN_BUNDLE);
const loseAudio = new Sound('lose.wav', Sound.MAIN_BUNDLE);
export default class GameCopy extends React.PureComponent {
	constructor(props) {
		super(props);
		const {player1, player2, player3, player4, pawn, pawn2} = this.props.route.params;
		this.state = {
			moves: 0,
			turn: BLUE,
			score: 0,
			score2: 0,
			red: this.initPlayer(RED, c.red, player3, [{}, {}, {}, {}]),
			green: this.initPlayer(GREEN, c.green, player2, pawn),
			blue: this.initPlayer(BLUE, c.blue, player1, pawn2),
			yellow: this.initPlayer(YELLOW, c.yellow, player4, [{}, {}, {}, {}]),
			disable: false,
			resultPopup: false,
			resultData: {},
			isRolling: false,
			opponentDice: 0,
			animateForSelection: false,
			isWaitingForRollDice: true,
			prevData: '',
			key: 0,
			timerRunning: true,
			diceNumber: 1,
			ping: 0,
		};

		this.roomId = '' + player1?.id;
		this.pawnDisable = false;
		this.prevPos = {};
		// this.ping = 0;
		this.pingTime = 0;

		this.netinfo = null;

		this.rollDice = this.rollDice.bind(this);
		this.onPieceSelection = this.onPieceSelection.bind(this);
		this.movePieceByPosition = this.movePieceByPosition.bind(this);
		this.playerHasUnfinishedPieces = this.playerHasUnfinishedPieces.bind(this);
		this.movePawnByStep = this.movePawnByStep.bind(this);
		this.movePawn = this.movePawn.bind(this);
		this.handleBackPress = this.handleBackPress.bind(this);
		this.handleUnsubscribe = this.handleUnsubscribe.bind(this);
		this.checkAutoMove = this.checkAutoMove.bind(this);
		this.onRefresh = this.onRefresh.bind(this);
	}

	componentDidMount() {
		// socket.on('connect', () => {
		// 	Alert.alert('Socket Connection', 'Connected');
		// 	socket.emit('ping', 'Ping');
		// });
		socket.emit('pong', 'Pong');

		socket.on('ping', () => {
			this.setState({ping: this.state.ping === 0 ? 'Connecting...' : Date.now() - this.pingTime});
			// this.ping = Date.now() - this.pingTime;
			setTimeout(() => {
				socket.emit('pong', 'Pong');
				this.pingTime = Date.now();
			}, 400);
		});
		// socket.on('disconnect', reason => {
		// 	if (reason === 'io client disconnect') {
		// 		Alert.alert('Connection Lost', 'Please check your internet connection and Retry', [
		// 			{
		// 				text: 'Retry',
		// 				onPress: () => socket.connect(),
		// 			},
		// 		]);
		// 	}
		// });

		// socket.connect();
		this.netinfo = NetInfo.addEventListener(state => {
			if (!state.isConnected || !state.isInternetReachable) {
				Alert.alert('Network Error', 'Your Connection is Lost, Please Restart Game', [
					{
						text: 'Retry',
						onPress: () => this.onRefresh(),
					},
				]);
			}
			if (state.isConnected) {
				socket.connect();
				socket.emit('createRoom', this.roomId);
				this.onRefresh();
			}
		});
		// console.log('Is Socket Connected', socket.connected);

		// socket.emit('createRoom', this.roomId);

		socket.on('diceRoll', data => {
			// console.log(data);
			setTimeout(() => {
				if (this.state.turn === BLUE) {
					this.setState({animateForSelection: false, opponentDice: data});
					diceAudio.play();
				} else {
					this.pawnDisable = false;
					this.setState({animateForSelection: true, moves: data, diceNumber: data, isRolling: false, isWaitingForRollDice: false});
					// if (this.playerHasUnfinishedPieces(this.state.green).length === 1) {
					// console.log('Green AutoPlay');
					this.checkAutoMove(this.state.green, data);
					// this.movePieceByPosition(this.playerHasUnfinishedPieces(this.state.green)[0], data);
					// }
				}
			}, 100);
			// setIsRolling(false);
			// console.log(this.state.turn);
		});

		socket.emit('joining', {
			room_id: this.roomId,
			game_id: this.props.route.params.gameId,
		});

		// socket.on('roomMessage', data => {
		// 	if (data.typee === 'joining') {
		// 		this.setState({turn: data.turn === this.props.route.params.user.id ? GREEN : BLUE});
		// 	}
		// });

		socket.on('pawnMove', async data => {
			// console.log(data);
			if (data.type === 'RETRY') {
				ToastAndroid.show('Retry', ToastAndroid.LONG);
				this.setState({prevData: '', timerRunning: true, animateForSelection: true});
				this.pawnDisable = false;
				return;
			}
			if (data.type === 'SUCCESS') {
				// console.log(data);
				data.opp_position.forEach(async item => {
					let player = item.color === BLUE ? this.state.blue : this.state.green;

					let piece =
						item.pawn === 1
							? player.pieces.one
							: item.pawn === 2
							? player.pieces.two
							: item.pawn === 3
							? player.pieces.three
							: item.pawn === 4
							? player.pieces.four
							: undefined;

					if (piece.name === this.prevPos.name && piece.color === GREEN && data.user_id === this.props.route.params.user.id) {
						// This Condition is only for Second User // This Will Move Pawn (Piece) From P52 to P1 //
						if (data.pawn_score > 25 && data.prev_score < 26) {
							let stepP = 25 - data.prev_score;
							let stepB = data.pawn_score - 25;
							if (stepP > 0) {
								let prevPosition = parseInt(this.prevPos.position.substring(1, this.prevPos.position.length));
								let newPosition = prevPosition + stepP;
								await new Promise((resolve, reject) => {
									resolve(this.movePawnByStep(prevPosition, newPosition, piece, 'P', null, item.position, data.sound));
								});
							} else if (stepB > 0) {
								let newPosition = stepB;
								await new Promise((resolve, reject) => {
									resolve(this.movePawnByStep(0, newPosition, piece, 'P'));
								});
							}
						} else if (data.pawn_score < 51) {
							let prevPosition = parseInt(this.prevPos.position.substring(1, this.prevPos.position.length));
							let newPosition = parseInt(item.position.substring(1, item.position.length));
							this.movePawnByStep(prevPosition, newPosition, piece, 'P', null, null, data.sound);
						} else if (data.prev_score < 51 && data.pawn_score > 50) {
							let stepP = 50 - data.prev_score;
							let stepB = data.pawn_score - 50;
							if (stepP > 0) {
								let prevPosition = parseInt(this.prevPos.position.substring(1, this.prevPos.position.length));
								let newPosition = prevPosition + 1;
								this.movePawnByStep(prevPosition, newPosition, piece, 'P', null, null, data.sound);
							}
							if (stepB > 0) {
								let newPosition = stepB;
								if (newPosition === 6) {
									this.movePawnByStep(1, 5, piece, 'G', null, item.position);
								} else {
									this.movePawnByStep(0, newPosition, piece, 'G', null, item.position);
								}
							}
						} else if (data.prev_score > 50 && data.pawn_score > 50) {
							let prevPosition = parseInt(this.prevPos.position.substring(1, this.prevPos.position.length));
							let newPosition = parseInt(item.position.substring(1, item.position.length));
							if (item.position === FINISHED) {
								this.movePawn(piece, item.position);
							} else {
								this.movePawnByStep(prevPosition, newPosition, piece, 'G');
							}
						}
					} else if (piece.position !== item.position && item.color !== GREEN) {
						///   Opposite   ///
						let prevPos = piece.position;
						if (data.sound === 'pawncut') {
							this.movePawn(piece, item.position, data.sound);
						} else if (data.pawn_score < 51) {
							let prevPosition = parseInt(prevPos.substring(1, prevPos.length));
							let newPosition = parseInt(item.position.substring(1, item.position.length));
							this.movePawnByStepFirst(prevPosition, newPosition, piece, 'P', null, data.sound);
						} else if (data.prev_score < 51 && data.pawn_score > 50) {
							let stepP = 50 - data.prev_score;
							let stepB = data.pawn_score - 50;
							if (stepP > 0) {
								let prevPosition = parseInt(prevPos.substring(1, prevPos.length));
								let newPosition = prevPosition + 1;
								this.movePawnByStepFirst(prevPosition, newPosition, piece, 'P', null, data.sound);
							}
							if (stepB > 0) {
								let newPosition = stepB;
								if (item.position === FINISHED) {
									this.movePawnByStepFirst(0, newPosition, piece, 'B', FINISHED);
								} else {
									this.movePawnByStepFirst(0, newPosition, piece, 'B');
								}
							}
						} else if (data.prev_score > 50 && data.pawn_score > 50) {
							let prevPosition = parseInt(prevPos.substring(1, prevPos.length));
							let newPosition = parseInt(item.position.substring(1, item.position.length));
							if (item.position === FINISHED) {
								this.movePawn(piece, item.position);
							} else {
								this.movePawnByStepFirst(prevPosition, newPosition, piece, 'B');
							}
						}
					}
					// Start code for Blue Piece on BT cut
					if (data.sound === 'pawncut' && item.color === GREEN && data.user_id !== this.props.route.params.user.id) {
						console.log('BT cut green screen Blue piece', 254);
						this.movePawn(piece, item.position, data.sound);
					} else if (data.sound === 'pawncut' && item.color === BLUE && data.user_id === this.props.route.params.user.id) {
						console.log('BT cut green screen green piece', 257);
						this.movePawn(piece, item.position, data.sound);
					}
					// End code for Green Piece on BT cut
				});
				data.all_positions.map(item => {
					const player = item.user_id === this.props.route.params.user.id ? this.state.green : this.state.blue;
					switch (item.pawn) {
						case 1:
							player.pieces.one.score = item.score;
							break;
						case 2:
							player.pieces.two.score = item.score;
							break;
						case 3:
							player.pieces.three.score = item.score;
							break;
						case 4:
							player.pieces.four.score = item.score;
							break;
					}
				});
				this.setState({disable: false});
			}
			if (data.user_id === this.props.route.params.user.id) {
				this.setState({score: data.score, score2: data.score1});
			} else {
				this.setState({score: data.score1, score2: data.score});
			}
			if (data.turn === this.props.route.params.user.id) {
				this.setState(prev => ({turn: GREEN, opponentDice: 0, key: prev.key + 1, timerRunning: true, isWaitingForRollDice: true, disable: false}));
			} else {
				this.setState(prev => ({turn: BLUE, opponentDice: 0, key: prev.key + 1, timerRunning: true, disable: false}));
			}

			if (data.type === 'FAILED') {
				// setPrevData({});
				if (data.turn === this.props.route.params.user.id) {
					this.setState(prev => ({turn: GREEN, opponentDice: 0, key: prev.key + 1, timerRunning: true, isWaitingForRollDice: true, prevData: {}, disable: false}));
				} else {
					this.setState(prev => ({turn: BLUE, opponentDice: 0, key: prev.key + 1, timerRunning: true, prevData: {}, disable: false}));
				}
			}

			if (data.type === 'WIN') {
				if (data.game_id != this.props.route.params.gameId) {
					return;
				}
				if (data.game_status.user_id === this.props.route.params.user.id) {
					this.setState({resultData: {title: 'Congratulations', message: 'You are Winner!', color: '#00ff00'}, resultPopup: true});
					winAudio.play();
				} else {
					this.setState({resultData: {title: 'Sorry', message: 'Try Next Time!', color: '#ff0000'}, resultPopup: true});
					loseAudio.play();
				}
			}

			if (data.type === 'REFRESH') {
				// ToastAndroid.show('Refresh', ToastAndroid.SHORT);
				data.opp_position.forEach(item => {
					let player = item.color === BLUE ? this.state.blue : this.state.green;

					let piece =
						item.pawn === 1
							? player.pieces.one
							: item.pawn === 2
							? player.pieces.two
							: item.pawn === 3
							? player.pieces.three
							: item.pawn === 4
							? player.pieces.four
							: undefined;

					this.movePawn(piece, item.position, 'refresh');
					piece.score = item.score;
				});
				// if(this.state.moves){
				this.setState({moves: this.state.moves, isWaitingForRollDice: this.state.isWaitingForRollDice});
				// }
				// if(this.state.isWaitingForRollDice){
				// this.setState({})
				// }
				if (data.user_id === this.props.route.params.user.id) {
					this.setState({score: data.score, score2: data.score1});
				} else {
					this.setState({score: data.score1, score2: data.score});
				}
				if (data.turn === this.props.route.params.user.id) {
					this.setState({turn: GREEN, opponentDice: 0, timerRunning: true});
				} else {
					this.setState({turn: BLUE, opponentDice: 0, timerRunning: true});
				}
			}

			if (data.type === 'EXIT') {
				// setTestState(prev => !prev);
				navigation.navigate('Home');
			}
			// setTestState(prev => !prev);
		});
		// AppState.addEventListener('change', state => {
		// 	return;
		// });
		BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
	}

	componentWillUnmount() {
		// socket.off('connect');
		// socket.off('disconnect');
		// socket.off('createRoom');
		// socket.off('diceRoll');
		// socket.off('ping');
		socket.off();
		socket.removeAllListeners();
		socket.close();
		// socket.disconnect();
		this.netinfo !== null && this.netinfo();
		BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
	}

	handleBackPress() {
		Alert.alert('Hold on!', 'Are you sure you want to go back?', [
			{
				text: 'Cancel',
				onPress: () => null,
				style: 'cancel',
			},
			{text: 'Exit', onPress: this.handleUnsubscribe},
		]);
		return true;
	}

	handleUnsubscribe() {
		socket.emit('exit', {
			room_id: this.roomId,
			id: this.props.route.params.insertId,
			user_id: this.props.route.params.user.id,
			game_id: this.props.route.params.gameId,
		});
	}

	getNumber() {
		if (this.props.route.params.gameId) {
			socket.emit(
				'diceRoll',
				{
					room_id: this.roomId,
					game_id: this.props.route.params.gameId,
					user_id: this.props.route.params.user.id,
					// number: number,
				},
				function (response, err) {
					console.log(response, err, 'Socketttt');
				}
			);
		}
	}

	rollDice() {
		if (!this.state.isWaitingForRollDice || this.state.disable) {
			return;
		}
		this.getNumber();
		this.setState({isWaitingForRollDice: false, isRolling: true});
		diceAudio.play();
	}

	initPlayer(playerType, color, info, pawns) {
		return {
			pieces: this.initPieces(playerType, pawns),
			color: color,
			player: playerType,
			...info,
		};
	}

	initPieces(playerColor, pawns) {
		return {
			one: {
				position: pawns[0].position,
				name: ONE,
				color: playerColor,
				score: 0,
			},
			two: {
				position: pawns[1].position,
				name: TWO,
				color: playerColor,
				score: 0,
			},
			three: {
				position: pawns[2].position,
				name: THREE,
				color: playerColor,
				score: 0,
			},
			four: {
				position: pawns[3].position,
				name: FOUR,
				color: playerColor,
				score: 0,
			},
		};
	}

	movePawnByStep(prevPosition, newPostion, piece, areaIndicator, finished = null, mv = null, sound) {
		piece.position = areaIndicator + ++prevPosition;
		// piece.updateTime = new Date().getTime();
		// setTestState(prev => !prev);
		this.forceUpdate();
		stepAudio.play();
		if (
			(prevPosition === 48 && newPostion === 48) ||
			(prevPosition === 9 && newPostion === 9) ||
			(prevPosition === 22 && newPostion === 22) ||
			(prevPosition === 35 && newPostion === 35)
		) {
			safeAudio.play();
		}
		if (sound === 'pawncut') {
			cutAudio.play();
			Vibration.vibrate(100);
		}
		const timeOut = setTimeout(async () => {
			if (prevPosition < newPostion) {
				this.movePawnByStep(prevPosition, newPostion, piece, areaIndicator, finished, mv);
				return;
			} else {
				if (mv !== null) {
					piece.position = mv;
					// piece.updateTime = new Date().getTime();
					// setTestState(prev => !prev);
					if (mv === FINISHED) {
						finishAudio.play();
					}
				}
				this.forceUpdate();
				clearTimeout(timeOut);
				this.prevPos = {};
				return true;
			}
		}, 400);
		this.prevPos = {};
	}

	movePawnByStepFirst(prevPosition, newPostion, piece, areaIndicator, finished = null, sound) {
		// console.log('Prev Position =', prevPosition, 'New Position =', newPostion, 'Piece =', piece, 'Cell Area =', areaIndicator, '\n');
		piece.position = areaIndicator + ++prevPosition;
		// piece.updateTime = Date.now();
		// setTestState(prev => !prev);
		// this.setState(prev => ({testState: !prev.testState}));
		this.forceUpdate();
		if (
			(prevPosition === 48 && newPostion === 48) ||
			(prevPosition === 9 && newPostion === 9) ||
			(prevPosition === 22 && newPostion === 22) ||
			(prevPosition === 35 && newPostion === 35)
		) {
			safeAudio.play();
		}
		if (sound === 'pawncut') {
			cutAudio.play();
			Vibration.vibrate(100);
		}
		stepAudio.play();
		const timeOut = setTimeout(() => {
			if (prevPosition < newPostion) {
				this.movePawnByStepFirst(prevPosition, newPostion, piece, areaIndicator, finished);
				return;
			} else {
				clearTimeout(timeOut);
				if (finished !== null) {
					piece.position = FINISHED;
					// piece.updateTime = Date.now();
					finishAudio.play();
				}
				this.forceUpdate();
				// setTestState(prev => !prev);
			}
		}, 400);
		// prevPos.current = {};
		// this.prevPos = {};
	}

	movePawn(pawn, position, sound) {
		pawn.position = position;
		// pawn.updateTime = new Date().getTime();
		if (sound !== 'refresh') {
			console.log(sound === 'refresh');
			this.setState({moves: 0, animateForSelection: false});
		}
		if (position === FINISHED && sound !== 'refresh') {
			finishAudio.play();
		}
		if ((position === P9 || position === P22 || position === P35 || position === P48) && sound !== 'refresh') {
			safeAudio.play();
		}
		if (sound === 'pawncut') {
			cutAudio.play();
			Vibration.vibrate(100);
		}
	}

	movePieceByPosition(piece, move) {
		if (piece.color !== GREEN || this.pawnDisable) {
			return;
		}
		this.pawnDisable = true;
		this.prevPos = piece;
		if (!this.state.isWaitingForRollDice) {
			const data = {
				user_id: this.props.route.params.user.id,
				room_id: this.roomId,
				game_id: this.props.route.params.gameId,
				score: move,
				position: piece.position,
				pawn: piece.name === ONE ? 1 : piece.name === TWO ? 2 : piece.name === THREE ? 3 : piece.name === FOUR ? 4 : undefined,
			};
			let newData = JSON.stringify(data);
			if (this.state.prevData !== newData) {
				socket.emit('pawnMove', data);
				this.setState({disable: true, prevData: newData, animateForSelection: false, timerRunning: false});
			}
		}
	}

	onRefresh() {
		socket.emit('refresh', {
			room_id: this.roomId,
			id: this.props.route.params.insertId,
			user_id: this.props.route.params.user.id,
			game_id: this.props.route.params.gameId,
		});
	}

	onPieceSelection(piece) {
		console.log(this.state.moves);
		if (this.state.moves) {
			this.movePieceByPosition(piece, this.state.moves);
		}
	}

	playerHasUnfinishedPieces(player) {
		const {one, two, three, four} = player.pieces;
		let countOfUnfinishedPieces = [];
		one.position !== FINISHED ? countOfUnfinishedPieces.push(one) : undefined;
		two.position !== FINISHED ? countOfUnfinishedPieces.push(two) : undefined;
		three.position !== FINISHED ? countOfUnfinishedPieces.push(three) : undefined;
		four.position !== FINISHED ? countOfUnfinishedPieces.push(four) : undefined;
		// console.log(player, 'Player', countOfUnfinishedPieces.length);
		return countOfUnfinishedPieces;
	}

	getFinishedPieces(player) {
		const {one, two, three, four} = player.pieces;
		let finishedPieces = [];
		one.position === 'FINISHED' ? finishedPieces.push(one) : undefined;
		two.position === 'FINISHED' ? finishedPieces.push(two) : undefined;
		three.position === 'FINISHED' ? finishedPieces.push(three) : undefined;
		four.position === 'FINISHED' ? finishedPieces.push(four) : undefined;
		return finishedPieces;
	}

	checkAutoMove(player, move) {
		const {one, two, three, four} = player.pieces;
		let pieces = [];
		if (parseInt(one.score) + move <= 56) {
			pieces.push(one);
		}
		if (parseInt(two.score) + move <= 56) {
			pieces.push(two);
		}
		if (parseInt(three.score) + move <= 56) {
			pieces.push(three);
		}
		if (parseInt(four.score) + move <= 56) {
			pieces.push(four);
		}
		// one.score + move <= 56 ? pieces.push(one) : undefined;
		// two.score + move <= 56 ? pieces.push(two) : undefined;
		// three.score + move <= 56 ? pieces.push(three) : undefined;
		// four.score + move <= 56 ? pieces.push(four) : undefined;

		if (pieces.length === 1) {
			this.movePieceByPosition(pieces[0], move);
		} else if (pieces.length <= 0) {
			this.movePieceByPosition(player.pieces.one, move);
			// socket.emit('turnChange', {
			// 	room_id: this.roomId,
			// 	game_id: this.props.route.params.gameId,
			// });
		}
		// return pieces;
	}
	render() {
		return (
			<ImageBackground source={BG} style={styles.container}>
				<StatusBar translucent backgroundColor={'#ffffff00'} />
				<Popup color={'#fff'} title={this.state.resultData.title} visible={this.state.resultPopup} bg={this.state.resultData.color}>
					<Text style={{color: '#fff', fontSize: 18, textAlign: 'center'}}>{this.state.resultData.message}</Text>
					<Button mode='contained' color={'#FFD101'} style={{alignSelf: 'center', marginTop: '5%'}} onPress={() => this.props.navigation.navigate('Home')}>
						Exit
					</Button>
				</Popup>
				<View style={[styles.topRow]}>
					<View style={styles.buttonContainer}>
						<Text style={{color: '#fff'}}>Prize: {this.props.route.params.bet}</Text>
					</View>
					<View style={styles.buttonContainer}>
						<Text style={{color: '#fff'}}>{this.props.route.params.gameId}</Text>
					</View>
					<TouchableOpacity style={styles.buttonContainer} activeOpacity={0.7} onPress={() => this.props.navigation.navigate('Settings')}>
						<Icon name='gear' type='evilicon' color={'#fff'} />
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
								borderColor:
									this.state.ping > 1000
										? '#fa3c3c'
										: this.state.ping > 700
										? '#fa953c'
										: this.state.ping > 400
										? '#faf03c'
										: this.state.ping > 0
										? '#4ffa3c'
										: '#fff',
							},
						]}>
						<Icon
							name={
								this.state.ping > 1000
									? 'wifi-strength-1'
									: this.state.ping > 700
									? 'wifi-strength-2'
									: this.state.ping > 400
									? 'wifi-strength-3'
									: this.state.ping > 0
									? 'wifi-strength-4'
									: undefined
							}
							color={
								this.state.ping > 1000
									? '#fa3c3c'
									: this.state.ping > 700
									? '#fa953c'
									: this.state.ping > 400
									? '#faf03c'
									: this.state.ping > 0
									? '#4ffa3c'
									: '#fff'
							}
							type='material-community'
							size={20}
						/>
						<Text
							style={{
								color:
									this.state.ping > 1000
										? '#fa3c3c'
										: this.state.ping > 700
										? '#fa953c'
										: this.state.ping > 400
										? '#faf03c'
										: this.state.ping > 0
										? '#4ffa3c'
										: '#fff',
								maxWidth: SW / 4,
							}}
							numberOfLines={1}>
							{this.state.ping}ms
						</Text>
					</View>
				</View>

				<View style={styles.board}>
					<View style={styles.playerSection}>
						<PlayerBox turn={this.state.turn} player={this.state.red} currentUser={GREEN} />
						<VerticalCellsContainer
							turn={this.state.turn}
							position={TOP_VERTICAL}
							game2
							moves={this.state.moves}
							onPieceSelection={this.onPieceSelection}
							pieces={{green: this.state.green, blue: this.state.blue}}
							animateForSelection={this.state.animateForSelection}
						/>
						<PlayerBox turn={this.state.turn} player={this.state.blue} score={this.state.score2} diceNumber={this.state.opponentDice} currentUser={GREEN} />
					</View>
					<HorizontalCellsContainer
						turn={this.state.turn}
						pieces={{green: this.state.green, blue: this.state.blue}}
						game2
						moves={this.state.moves}
						animateForSelection={this.state.animateForSelection}
						blueFinished={this.getFinishedPieces(this.state.blue)}
						greenFinished={this.getFinishedPieces(this.state.green)}
						onPieceSelection={this.onPieceSelection}
					/>
					<View style={styles.playerSection}>
						<PlayerBox turn={this.state.turn} player={this.state.green} score={this.state.score} currentUser={GREEN} />
						<VerticalCellsContainer
							turn={this.state.turn}
							position={BOTTOM_VERTICAL}
							game2
							moves={this.state.moves}
							onPieceSelection={this.onPieceSelection}
							pieces={{green: this.state.green, blue: this.state.blue}}
							animateForSelection={this.state.animateForSelection}
						/>
						<PlayerBox turn={this.state.turn} player={this.state.yellow} currentUser={GREEN} />
					</View>
				</View>
				<Dice
					onDiceRoll={this.rollDice}
					timerRunning={this.state.timerRunning}
					diceNumber={this.state.diceNumber}
					turn={this.state.turn}
					// onComplete={handleUnsubscribe}
					onComplete={() => {
						if (this.state.turn === GREEN) {
							setTimeout(this.handleUnsubscribe, 5000);
						} else {
							setTimeout(this.handleUnsubscribe, 10000);
						}
					}}
					timerKey={this.state.key}
					isRolling={this.state.isRolling}
					currentUser={GREEN}
					isWaitingForRollDice={this.state.isWaitingForRollDice}
				/>
				<IconButton icon='refresh' color={c.blue} style={{backgroundColor: '#fff', position: 'absolute', bottom: '3%'}} onPress={this.onRefresh} />
				{/* <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', position: 'absolute', top: '20%'}}>
					<TouchableOpacity style={{backgroundColor: 'white', padding: 10, margin: 10}} onPress={() => this.rollDice(1)}>
						<Text>1</Text>
					</TouchableOpacity>
					<TouchableOpacity style={{backgroundColor: 'white', padding: 10, margin: 10}} onPress={() => this.rollDice(2)}>
						<Text>2</Text>
					</TouchableOpacity>
					<TouchableOpacity style={{backgroundColor: 'white', padding: 10, margin: 10}} onPress={() => this.rollDice(3)}>
						<Text>3</Text>
					</TouchableOpacity>
					<TouchableOpacity style={{backgroundColor: 'white', padding: 10, margin: 10}} onPress={() => this.rollDice(4)}>
						<Text>4</Text>
					</TouchableOpacity>
					<TouchableOpacity style={{backgroundColor: 'white', padding: 10, margin: 10}} onPress={() => this.rollDice(5)}>
						<Text>5</Text>
					</TouchableOpacity>
					<TouchableOpacity style={{backgroundColor: 'white', padding: 10, margin: 10}} onPress={() => this.rollDice(6)}>
						<Text>6</Text>
					</TouchableOpacity>
				</View> */}
			</ImageBackground>
		);
	}
}
