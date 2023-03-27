import React from 'react';
import {Alert, BackHandler, ImageBackground, StatusBar, Text, ToastAndroid, TouchableOpacity, View, Vibration} from 'react-native';
import {Button, IconButton} from 'react-native-paper';
import io from 'socket.io-client';
import Sound from 'react-native-sound';
import NetInfo from '@react-native-community/netinfo';
import {Icon} from 'react-native-elements';

import styles from '../Game/Styles/styles';
import {c} from '../Game/Utils/colors';
import BG from '../Game/Assets/Backgrounds/GridBG.png';
import Popup from '../Components/Popup';
import Dice from '../Game/Components/Dice';
import {SW} from '../Config/Config';

import VerticalCellsContainer from '../Game/Components/VerticalCellsContainer';
import HorizontalCellsContainer from '../Game/Components/HorizontalCellsContainer';
import PlayerBox from '../Game/Components/PlayerBox';
import {BLUE, BOTTOM_VERTICAL, FINISHED, FOUR, GREEN, ONE, P22, P35, P48, P9, RED, SOCKET_API, THREE, TOP_VERTICAL, TWO, YELLOW} from '../Game/Utils/constants';

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
export default class GamePure extends React.PureComponent {
	constructor(props) {
		super(props);
		// console.log(this.props);
		const {player1, player2, player3, player4, pawn, pawn2} = this.props.route.params;
		this.state = {
			opponentDice: 1,
			resultPopup: false,
			resultData: {},
			isRolling: false,
			animateForSelection: false,
			isWaitingForRollDice: true,
			disable: false,
			prevData: {},
			key: 0,
			timerRunning: true,
			moves: 0,
			turn: BLUE,
			score: 0,
			score2: 0,
			diceNumber: 1,
			testState: true,
			red: this.initPlayer(RED, c.red, player3, [{}, {}, {}, {}]),
			blue: this.initPlayer(BLUE, c.blue, player1, pawn2),
			green: this.initPlayer(GREEN, c.green, player2, pawn),
			yellow: this.initPlayer(YELLOW, c.yellow, player4, [{}, {}, {}, {}]),
			ping: 0,
			prevPing: 1,
		};

		this.roomId = '' + player1.id;

		this.netinfo = null;
		this.pingTime = 0;

		this.rollDice = this.rollDice.bind(this);
		this.onPieceSelection = this.onPieceSelection.bind(this);
		this.movePieceByPosition = this.movePieceByPosition.bind(this);
		this.movePawnByStep = this.movePawnByStep.bind(this);
		this.movePawn = this.movePawn.bind(this);
		this.handleUnsubscribe = this.handleUnsubscribe.bind(this);
		this.handleBackPress = this.handleBackPress.bind(this);
		this.playerHasUnfinishedPieces = this.playerHasUnfinishedPieces.bind(this);
		this.checkAutoMove = this.checkAutoMove.bind(this);
		this.onRefresh = this.onRefresh.bind(this);

		this.pawnDisable = false;
	}

	componentDidMount() {
		socket.emit('pong', 'Pong');

		socket.on('ping', () => {
			// if (this.state.prevPing === 0) {
			// 	Alert.alert('Hellloo');
			// }
			this.setState({prevPing: this.state.ping, ping: this.state.ping === 0 ? 'Connecting...' : Date.now() - this.pingTime});
			setTimeout(() => {
				socket.emit('pong', 'Pong');
				this.pingTime = Date.now();
			}, 400);
		});

		// socket.connect();

		// socket.emit('createRoom', this.roomId);

		this.netinfo = NetInfo.addEventListener(state => {
			if (!state.isConnected) {
				Alert.alert('Network Error', 'Your Connection is Lost, Please Restart Game', [
					{
						text: 'Ok',
						onPress: () => this.setState({prevPing: 0}),
					},
				]);
			}
			if (state.isConnected) {
				socket.connect();
				socket.emit('createRoom', this.roomId);
				this.onRefresh();
			}
		});

		socket.on('diceRoll', data => {
			// console.log(data, 'Dice Roll \n');
			setTimeout(() => {
				if (this.state.turn === GREEN) {
					this.setState({animateForSelection: false, opponentDice: data});
					diceAudio.play();
				} else {
					this.pawnDisable = false;
					this.setState({moves: data, diceNumber: data, isWaitingForRollDice: false, isRolling: false, animateForSelection: true});
					this.checkAutoMove(this.state.blue, data);
					// if (this.playerHasUnfinishedPieces(this.state.blue).length === 1) {
					// 	this.movePieceByPosition(this.playerHasUnfinishedPieces(this.state.blue)[0], data);
					// }
				}
			}, 100);
		});

		socket.on('pawnMove', data => {
			// console.log(data, 'Pawn Move Data \n');
			if (data.type === 'RETRY') {
				this.pawnDisable = false;
				ToastAndroid.show('Retry', ToastAndroid.LONG);
				this.setState({prevData: '', animateForSelection: true});
				return;
			}
			if (data.type === 'SUCCESS') {
				this.setState({timerRunning: false});
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
					// console.log(this.prevPos, 'aaaaaaaaaaaaa');
					// console.log(piece.name, 'Piece name');
					if (piece.name === this.prevPos.name && piece.color === 'blue' && data.user_id === this.props.route.params.user.id) {
						if (data.pawn_score < 51) {
							// console.log('hhhhhhhh');
							let prevPosition = parseInt(this.prevPos.position.substring(1, this.prevPos.position.length));
							let newPosition = parseInt(item.position.substring(1, item.position.length));
							await this.movePawnByStep(prevPosition, newPosition, piece, 'P', null, data.sound);
						} else if (data.prev_score < 51 && data.pawn_score > 50) {
							// console.log('ggggggg');
							let stepP = 50 - data.prev_score;
							let stepB = data.pawn_score - 50;
							if (stepP > 0) {
								let prevPosition = parseInt(this.prevPos.position.substring(1, this.prevPos.position.length));
								let newPosition = prevPosition + 1;
								await this.movePawnByStep(prevPosition, newPosition, piece, 'P', null, data.sound);
							}
							if (stepB > 0) {
								let newPosition = stepB;
								if (item.position === FINISHED) {
									await this.movePawnByStep(0, newPosition, piece, 'B', FINISHED);
								} else {
									await this.movePawnByStep(0, newPosition, piece, 'B');
								}
							}
						} else if (data.prev_score > 50 && data.pawn_score > 50) {
							// console.log('aaaaaaaaa');
							let prevPosition = parseInt(this.prevPos.position.substring(1, this.prevPos.position.length));
							let newPosition = parseInt(item.position.substring(1, item.position.length));
							if (item.position === FINISHED) {
								this.movePawn(piece, item.position);
							} else {
								await this.movePawnByStep(prevPosition, newPosition, piece, 'B');
							}
						}
					} else if (piece.position !== item.position && item.color !== BLUE) {
						let prevPos = piece.position;

						if (data.sound === 'pawncut') {
							this.movePawn(piece, item.position, data.sound);
						} else if (data.pawn_score > 25 && data.prev_score < 26) {
							// console.log('aaaaaaa');
							let stepP = 25 - data.prev_score;
							let stepB = data.pawn_score - 25;
							// console.log(stepP, stepB);
							if (stepP > 0) {
								// console.log('pppppp', Date.now());
								let prevPosition = parseInt(prevPos.substring(1, prevPos.length));
								let newPosition = prevPosition + stepP;
								await new Promise((resolve, reject) => {
									resolve(this.movePawnByStepSecond(prevPosition, newPosition, piece, 'P', null, item.position, data.sound));
								});
							} else if (stepB > 0) {
								// console.log('bbbbbb', Date.now());
								let newPosition = stepB;
								await new Promise((resolve, reject) => {
									resolve(this.movePawnByStepSecond(0, newPosition, piece, 'P'));
								});
							}
						} else if (data.pawn_score < 51) {
							// console.log('bbbbbbb');
							// console.log(prevPos);
							let prevPosition = parseInt(prevPos.substring(1, prevPos.length));
							let newPosition = parseInt(item.position.substring(1, item.position.length));
							this.movePawnByStepSecond(prevPosition, newPosition, piece, 'P', null, null, data.sound);
						} else if (data.prev_score < 51 && data.pawn_score > 50) {
							// console.log('ccccccc');
							let stepP = 50 - data.prev_score;
							let stepB = data.pawn_score - 50;
							if (stepP > 0) {
								let prevPosition = parseInt(prevPos.substring(1, prevPos.length));
								let newPosition = prevPosition + 1;
								this.movePawnByStepSecond(prevPosition, newPosition, piece, 'P', null, null, data.sound);
							}
							if (stepB > 0) {
								let newPosition = stepB;
								if (newPosition === 6) {
									this.movePawnByStepSecond(1, 5, piece, 'G', null, item.position);
								} else {
									this.movePawnByStepSecond(0, newPosition, piece, 'G', null, item.position);
								}
							}
						} else if (data.prev_score > 50 && data.pawn_score > 50) {
							// console.log('dddddddd');
							let prevPosition = parseInt(prevPos.substring(1, prevPos.length));
							let newPosition = parseInt(item.position.substring(1, item.position.length));
							if (item.position === FINISHED) {
								this.movePawn(piece, item.position);
							} else {
								this.movePawnByStepSecond(prevPosition, newPosition, piece, 'G');
							}
						}
					}
					// Start code for Blue Piece on BT cut
					if (data.sound === 'pawncut' && item.color === BLUE && data.user_id !== this.props.route.params.user.id) {
						// console.log('BT cut blue screen Blue piece', 254);
						this.movePawn(piece, item.position, data.sound);
					} else if (data.sound === 'pawncut' && item.color === GREEN && data.user_id === this.props.route.params.user.id) {
						// console.log('BT cut blue screen green piece', 257);
						this.movePawn(piece, item.position, data.sound);
					}
					// End code for Green Piece on BT cut
					this.setState({disable: false});
				});
				data.all_positions.map(item => {
					const player = item.user_id === this.props.route.params.user.id ? this.state.blue : this.state.green;
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

				if (data.user_id === this.props.route.params.user.id) {
					this.setState({score: data.score, score2: data.score1});
				} else {
					this.setState({score: data.score1, score2: data.score});
				}
				if (data.turn === this.props.route.params.user.id) {
					this.setState(prev => ({turn: BLUE, opponentDice: 0, key: prev.key + 1, timerRunning: true, isWaitingForRollDice: true}));
				} else {
					this.setState(prev => ({turn: GREEN, opponentDice: 0, key: prev.key + 1, timerRunning: true}));
				}
				// this.forceUpdate();
				this.setState({disable: false});
			}

			if (data.type === 'FAILED') {
				// socket.emit('turnChange', data.query);
				if (data.turn === this.props.route.params.user.id) {
					this.setState(prev => ({turn: BLUE, opponentDice: 0, key: prev.key + 1, timerRunning: true, isWaitingForRollDice: true, prevData: {}, disable: false}));
				} else {
					this.setState(prev => ({turn: GREEN, setOpponentDice: 0, key: prev.key + 1, timerRunning: true, prevData: {}, disable: false}));
				}
			}

			if (data.type === 'WIN') {
				if (data.game_status.user_id === this.props.route.params.user.id) {
					this.setState({resultData: {title: 'Congratulations', message: 'You are Winner!', color: '#00ff00'}, resultPopup: true, opponentDice: 0});
					winAudio.play();
				} else {
					this.setState({resultData: {title: 'Sorry', message: 'Try Next Time!', color: '#ff0000'}, resultPopup: true, opponentDice: 0});
					loseAudio.play();
				}
			}

			if (data.type === 'REFRESH') {
				ToastAndroid.show('Refresh', ToastAndroid.SHORT);
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
				if (data.user_id === this.props.route.params.user.id) {
					this.setState({score: data.score, score2: data.score1});
				} else {
					this.setState({score: data.score1, score2: data.score});
				}
				if (data.turn === this.props.route.params.user.id) {
					this.setState({turn: BLUE, opponentDice: 0, timerRunning: true});
				} else {
					this.setState({turn: GREEN, opponentDice: 0, timerRunning: true});
				}
			}

			if (data.type === 'EXIT') {
				// setTestState(prev => !prev);
				this.props.navigation.navigate('Home');
			}
		});
		// AppState.addEventListener('change', state => {
		// 	return;
		// });
		BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
	}

	componentWillUnmount() {
		// socket.off('createRoom');
		// socket.off('diceRoll');
		// socket.off('pawnMove');
		// socket.off('ping');
		socket.off();
		socket.removeAllListeners();
		socket.close();
		// socket.disconnect();
		this.netinfo !== null && this.netinfo();
		BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
	}

	// shouldComponentUpdate(nextProps, nextState) {
	// 	return this.props !== nextProps || this.state !== nextState;
	// }

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
		socket.emit('diceRoll', {
			room_id: this.roomId,
			game_id: this.props.route.params.gameId,
			user_id: this.props.route.params.user.id,
		});
	}

	rollDice() {
		if (!this?.state?.isWaitingForRollDice || this?.state?.disable) {
			// console.log(this?.state?.isWaitingForRollDice, this?.state?.disable);
			return;
		}
		this.setState({isWaitingForRollDice: false, isRolling: true});
		diceAudio.play();
		this.getNumber();
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

	async movePawnByStep(prevPosition, newPostion, piece, areaIndicator, finished = null, sound) {
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
		const timeOut = setTimeout(async () => {
			if (prevPosition < newPostion) {
				await this.movePawnByStep(prevPosition, newPostion, piece, areaIndicator, finished);
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
		this.prevPos = {};
	}

	movePawnByStepSecond(prevPosition, newPostion, piece, areaIndicator, finished = null, mv = null, sound) {
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
				this.movePawnByStepSecond(prevPosition, newPostion, piece, areaIndicator, finished, mv);
			} else {
				// console.log(mv, 'MV 111111111111111111');
				if (mv !== null) {
					piece.position = mv;
					// console.log(mv, 'MV Loggggggggggg');
					// piece.updateTime = new Date().getTime();
					// setTestState(prev => !prev);
					if (mv === FINISHED) {
						finishAudio.play();
					}
				}
				this.forceUpdate();
				clearTimeout(timeOut);
				// this.prevPos = {};
				return true;
			}
		}, 400);
		// this.prevPos = {};
	}

	moveStepTest(prevPosition, newPostion, piece, areaIndicator, finished = null, mv = null, sound) {
		for (let i = prevPosition; i < newPostion; ) {
			piece.position = areaIndicator + ++i;
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
				this.forceUpdate();
				clearTimeout(timeOut);
			}, 400);
		}
		if (mv !== null) {
			piece.position = mv;
			if (mv === FINISHED) {
				finishAudio.play();
			}
		}
		this.prevPos = {};
	}

	movePawn(pawn, position, sound) {
		pawn.position = position;
		// console.log(pawn, 'is moved to', position, 'after cutt');
		if (sound !== 'refresh') {
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
		// console.log(this.pawnDisable, 'IS DISABLE');
		if (piece.color !== 'blue') {
			return;
		}
		if (this.pawnDisable) {
			return;
		}
		// setPawnDisable(true);
		this.pawnDisable = true;
		this.prevPos = piece;
		// console.log(piece, 'Move this piece');
		if (!this.state.isWaitingForRollDice || this.state.disable) {
			// dispatch(setMoves(0));
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
		// console.log('HHHHHH');
		socket.emit('refresh', {
			room_id: this.roomId,
			id: this.props.route.params.insertId,
			user_id: this.props.route.params.user.id,
			game_id: this.props.route.params.gameId,
		});
	}

	onPieceSelection(piece) {
		if (this.state?.moves) {
			this.movePieceByPosition(piece, this.state?.moves);
		}
	}

	playerHasUnfinishedPieces(player) {
		const {one, two, three, four} = player.pieces;
		let countOfUnfinishedPieces = [];
		one.position !== FINISHED ? countOfUnfinishedPieces.push(one) : undefined;
		two.position !== FINISHED ? countOfUnfinishedPieces.push(two) : undefined;
		three.position !== FINISHED ? countOfUnfinishedPieces.push(three) : undefined;
		four.position !== FINISHED ? countOfUnfinishedPieces.push(four) : undefined;
		// console.log(player, 'Player', countOfUnfinishedPieces);
		return countOfUnfinishedPieces;
	}

	getFinishedPieces(player) {
		const {one, two, three, four} = player.pieces;
		let finishedPieces = [];
		one.position === FINISHED ? finishedPieces.push(one) : undefined;
		two.position === FINISHED ? finishedPieces.push(two) : undefined;
		three.position === FINISHED ? finishedPieces.push(three) : undefined;
		four.position === FINISHED ? finishedPieces.push(four) : undefined;
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
		// console.log(pieces);
		if (pieces.length === 1) {
			this.movePieceByPosition(pieces[0], move);
		} else if (pieces.length <= 0) {
			this.movePieceByPosition(player.pieces.one, move);
			// socket.emit('turnChange', {
			// 	room_id: this.roomId,
			// 	game_id: this.props.route.params.gameId,
			// });
		}
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
				<View style={styles.topRow}>
					<View style={styles.buttonContainer}>
						<Text style={{color: '#fff'}}>Prize: {this.props.route.params.bet}</Text>
					</View>
					<View style={styles.buttonContainer}>
						<Text style={{color: '#fff'}}>{this.props.route.params.gameId}</Text>
					</View>
					<TouchableOpacity activeOpacity={0.7} onPress={() => this.props.navigation.navigate('Settings')} style={styles.buttonContainer}>
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
						<PlayerBox turn={this.state.turn} player={this.state.red} currentUser={BLUE} />
						<VerticalCellsContainer
							position={TOP_VERTICAL}
							turn={this.state.turn}
							moves={this.state.moves}
							onPieceSelection={this.onPieceSelection}
							pieces={{green: this.state.green, blue: this.state.blue}}
							animateForSelection={this.state.animateForSelection}
						/>
						<PlayerBox turn={this.state.turn} player={this.state.green} score={this.state.score2} currentUser={BLUE} diceNumber={this.state.opponentDice} />
					</View>
					<HorizontalCellsContainer
						pieces={{green: this.state.green, blue: this.state.blue}}
						blueFinished={this.getFinishedPieces(this.state.blue)}
						greenFinished={this.getFinishedPieces(this.state.green)}
						turn={this.state.turn}
						moves={this.state.moves}
						onPieceSelection={this.onPieceSelection}
						animateForSelection={this.state.animateForSelection}
					/>
					<View style={styles.playerSection}>
						<PlayerBox turn={this.state.turn} player={this.state.blue} score={this.state.score} currentUser={BLUE} />
						<VerticalCellsContainer
							position={BOTTOM_VERTICAL}
							turn={this.state.turn}
							moves={this.state.moves}
							onPieceSelection={this.onPieceSelection}
							pieces={{green: this.state.green, blue: this.state.blue}}
							animateForSelection={this.state.animateForSelection}
						/>
						<PlayerBox turn={this.state.turn} player={this.state.yellow} currentUser={BLUE} />
					</View>
				</View>
				<Dice
					onDiceRoll={this.rollDice}
					onComplete={() => {
						if (this.state.turn === BLUE) {
							setTimeout(this.handleUnsubscribe, 5000);
						} else {
							setTimeout(this.handleUnsubscribe, 10000);
						}
					}}
					turn={this?.state?.turn}
					diceNumber={this?.state?.diceNumber}
					isRolling={this?.state?.isRolling}
					currentUser={BLUE}
					timerRunning={this?.state?.timerRunning}
					timerKey={this?.state?.key}
					isWaitingForRollDice={this?.state?.isWaitingForRollDice}
				/>
				<IconButton icon='refresh' color={c.blue} style={{backgroundColor: '#fff', position: 'absolute', bottom: '3%'}} onPress={this.onRefresh} />
			</ImageBackground>
		);
	}
}
