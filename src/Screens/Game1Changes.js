import React from 'react';
import {Alert, BackHandler, ImageBackground, StatusBar, Text, ToastAndroid, View} from 'react-native';
import {Button} from 'react-native-paper';
import io from 'socket.io-client';
import VerticalCellsContainer from '../Game/Components/VerticalCellsContainer';
import HorizontalCellsContainer from '../Game/Components/HorizontalCellsContainer';
import PlayerBox from '../Game/Components/PlayerBox';
import styles from '../Game/Styles/styles';
import {c} from '../Game/Utils/colors';
import {BLUE, BOTTOM_VERTICAL, FINISHED, FOUR, GREEN, ONE, P22, P35, P48, P9, RED, SOCKET_API, THREE, TOP_VERTICAL, TWO, YELLOW} from '../Game/Utils/constants';
import BG from '../Game/Assets/Backgrounds/GridBG.png';
import Popup from '../Components/Popup';
import Dice from '../Game/Components/Dice';
import Sound from 'react-native-sound';
import NetInfo from '@react-native-community/netinfo';

const socket = io(SOCKET_API, {
	reconnection: true,
	reconnectionDelay: 1000,
	reconnectionAttempts: 20,
	reconnectionDelayMax: 5000,
	autoConnect: true,
});

const stepAudio = new Sound('step.wav', Sound.MAIN_BUNDLE, error => {
	if (error) {
		console.log('Failed To Load Step Audio', error);
		return;
	}
});
const diceAudio = new Sound('dice.mp3', Sound.MAIN_BUNDLE, error => {
	if (error) {
		console.log('Failed To Load Dice Audio', error);
		return;
	}
});
const safeAudio = new Sound('safe.wav', Sound.MAIN_BUNDLE, error => {
	if (error) {
		console.log('Failed To Load Safe Audio', error);
		return;
	}
});
const cutAudio = new Sound('cut.wav', Sound.MAIN_BUNDLE, error => {
	if (error) {
		console.log('Failed To Load Cut Audio', error);
		return;
	}
});
const finishAudio = new Sound('finish.wav', Sound.MAIN_BUNDLE, error => {
	if (error) {
		console.log('Failed To Load Finish Audio', error);
		return;
	}
});
const winAudio = new Sound('win.wav', Sound.MAIN_BUNDLE, error => {
	if (error) {
		console.log('Failed To Load Win Audio', error);
		return;
	}
});
const loseAudio = new Sound('lose.wav', Sound.MAIN_BUNDLE, error => {
	if (error) {
		console.log('Failed To Load Lose Audio', error);
		return;
	}
});
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
		};

		this.roomId = '' + player1.id;

		this.rollDice = this.rollDice.bind(this);
		this.onPieceSelection = this.onPieceSelection.bind(this);
		this.movePieceByPosition = this.movePieceByPosition.bind(this);
		this.movePawnByStep = this.movePawnByStep.bind(this);
		this.movePawn = this.movePawn.bind(this);
		this.handleUnsubscribe = this.handleUnsubscribe.bind(this);
		this.handleBackPress = this.handleBackPress.bind(this);
		this.playerHasUnfinishedPieces = this.playerHasUnfinishedPieces.bind(this);

		this.pawnDisable = false;
	}

	componentDidMount() {
		socket.connect();

		socket.emit('createRoom', this.roomId);

		NetInfo.addEventListener(state => {
			if (!state.isConnected) {
				Alert.alert('Network Error', 'Your Connection is Lost, Please Restart Game');
			}
			if (!state.isInternetReachable) {
				Alert.alert('Network Weak', 'Your Internet Connection is Slow');
			}
		});

		socket.on('diceRoll', data => {
			// console.log(data, 'Dice Roll \n');
			setTimeout(() => {
				if (this.state.turn === GREEN) {
					this.setState({animateForSelection: true, opponentDice: data});
					diceAudio.play();
				} else {
					this.pawnDisable = false;
					this.setState({moves: data, diceNumber: data, isWaitingForRollDice: false, isRolling: false, animateForSelection: true});
					if (this.playerHasUnfinishedPieces(this.state.blue).length === 1) {
						this.movePieceByPosition(this.playerHasUnfinishedPieces(this.state.blue)[0], data);
					}
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
			if (data.type === 'SUCCESS' || data.type === 'REFRESH') {
				this.setState({timerRunning: false});
				if (data.type === 'REFRESH') {
					ToastAndroid.show('Refreshing Done!', ToastAndroid.LONG);
				}
				data.opp_position.forEach(async item => {
					let player = item.color === BLUE ? this.state.blue : this.state.green;
					// console.log(player, 'PLLLLAAAAYYYEERRR');

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
					if (piece.name === this.prevPos.name && piece.color === 'blue' && data.user_id === this.props.route.params.user.id) {
						if (data.pawn_score < 51) {
							let prevPosition = parseInt(this.prevPos.position.substring(1, this.prevPos.position.length));
							let newPosition = parseInt(item.position.substring(1, item.position.length));
							await this.movePawnByStep(prevPosition, newPosition, piece, 'P', null, data.sound);
						} else if (data.prev_score < 51 && data.pawn_score > 50) {
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
							let prevPosition = parseInt(this.prevPos.position.substring(1, this.prevPos.position.length));
							let newPosition = parseInt(item.position.substring(1, item.position.length));
							if (item.position === FINISHED) {
								this.movePawn(piece, item.position);
							} else {
								await this.movePawnByStep(prevPosition, newPosition, piece, 'B');
							}
						}
					} else {
						// this.movePawn(piece, item.position, data.sound);
						let newPosition = parseInt(item.position.substring(1, item.position.length));
						let prevPosition = parseInt(piece.position.substring(1, piece.position.length));
						let prevIndicator = piece.position.substring(0, 1);
						let newIndicator = piece.position.substring(0, 1);
						if (newPosition > prevPosition && (newIndicator !== 'B' || newIndicator !== 'G')) {
							console.log(111111);
							this.movePawnByStep(prevPosition, newPosition, piece, newIndicator, null, item.sound);
						} else if (newIndicator === 'G' && prevIndicator === 'P') {
							console.log(22222);
							let stepP = 51 - prevPosition;
							let stepG = newPosition;
							if (stepP > 0) {
								console.log(33333);
								let newPosition = stepP + prevPosition;
								this.movePawnByStep(prevPosition, newPosition, piece, prevIndicator, null, data.sound);
							}
							if (stepG > 0) {
								console.log(444444);
								if (item.position === FINISHED) {
									this.movePawnByStep(0, stepG, piece, newIndicator, FINISHED);
								} else {
									this.movePawnByStep(0, stepG, piece, newIndicator, null, data.sound);
								}
							}
						} else if (newIndicator === prevIndicator && newPosition < prevPosition) {
							console.log(555555);
							await this.movePawnByStep(prevPosition, 52, piece, prevIndicator, null, data.sound).then(res => {
								console.log(res);
								this.movePawnByStep(0, newPosition, piece, newIndicator, null, data.sound);
							});
						}
					}
					this.setState({disable: false});
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

			if (data.type === 'EXIT') {
				// setTestState(prev => !prev);
				this.props.navigation.navigate('Home');
			}
		});
		BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
	}

	componentWillUnmount() {
		socket.off('createRoom');
		socket.disconnect();
		socket.off('diceRoll');
		socket.off('pawnMove');
		socket.disconnect();
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
		let time = Date.now();
		return {
			one: {
				position: pawns[0].position,
				name: ONE,
				color: playerColor,
				updateTime: time,
			},
			two: {
				position: pawns[1].position,
				name: TWO,
				color: playerColor,
				updateTime: time,
			},
			three: {
				position: pawns[2].position,
				name: THREE,
				color: playerColor,
				updateTime: time,
			},
			four: {
				position: pawns[3].position,
				name: FOUR,
				color: playerColor,
				updateTime: time,
			},
		};
	}

	async movePawnByStep(prevPosition, newPostion, piece, areaIndicator, finished = null, sound) {
		piece.position = areaIndicator + ++prevPosition;
		piece.updateTime = Date.now();
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
					piece.updateTime = Date.now();
					finishAudio.play();
				}
				this.forceUpdate();
				return 'next';
			}
		}, 400);
		this.prevPos = {};
	}

	movePawn(pawn, position, sound) {
		pawn.position = position;
		pawn.updateTime = Date.now();
		// dispatch(setMoves(0));
		// setAnimateForSelection(false);
		this.setState({moves: 0, animateForSelection: false});
		if (position === FINISHED) {
			finishAudio.play();
		}
		if (position === P9 || position === P22 || position === P35 || position === P48) {
			safeAudio.play();
		}
		if (sound === 'pawncut') {
			cutAudio.play();
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
		let finishedPieces = [];
		player.pieces.one.position === FINISHED ? finishedPieces.push(player.pieces.one) : undefined;
		player.pieces.two.position === FINISHED ? finishedPieces.push(player.pieces.two) : undefined;
		player.pieces.three.position === FINISHED ? finishedPieces.push(player.pieces.three) : undefined;
		player.pieces.four.position === FINISHED ? finishedPieces.push(player.pieces.four) : undefined;
		return finishedPieces;
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
				<View
					style={{
						flexDirection: 'row',
						alignItems: 'center',
						justifyContent: 'space-between',
						position: 'absolute',
						top: StatusBar.currentHeight + 10,
						width: '100%',
						paddingHorizontal: '4%',
					}}>
					<Text style={{color: '#fff', fontWeight: 'bold', fontSize: 14}}>Prize: {this.props.route.params.bet}</Text>
					<Text
						style={{
							fontSize: 18,
							fontWeight: 'bold',
							color: '#fff',
						}}>
						{this.props.route.params.gameId}
					</Text>
					{/* <View style={{flexDirection: 'row', alignItems: 'center'}}>
					<Icon
						name={
							latency > 1000
								? 'wifi-strength-1'
								: latency > 700
								? 'wifi-strength-2'
								: latency > 400
								? 'wifi-strength-3'
								: latency > 100
								? 'wifi-strength-4'
								: undefined
						}
						color={latency > 1000 ? '#fa3c3c' : latency > 700 ? '#fa953c' : latency > 400 ? '#faf03c' : latency > 100 ? '#4ffa3c' : '#fff'}
						type='material-community'
						size={20}
					/>
					<Text
						style={{
							fontSize: 14,
							fontWeight: 'bold',
							color: latency > 1000 ? '#fa3c3c' : latency > 700 ? '#fa953c' : latency > 400 ? '#faf03c' : latency > 100 ? '#4ffa3c' : '#fff',
						}}>
						{latency}ms
					</Text>
				</View> */}
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
				{/* <IconButton icon='refresh' color={c.blue} style={{backgroundColor: '#fff', position: 'absolute', bottom: '3%'}} onPress={onRefresh} /> */}
			</ImageBackground>
		);
	}
}
