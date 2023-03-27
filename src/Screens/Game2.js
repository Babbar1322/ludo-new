import React, {useEffect, useLayoutEffect, useState, useRef} from 'react';
import {View, Text, ImageBackground, StatusBar, ToastAndroid, BackHandler, Alert} from 'react-native';
import io from 'socket.io-client';

// Components
import VerticalCellsContainer from '../Game/Components/VerticalCellsContainer';
import HorizontalCellsContainer from '../Game/Components/HorizontalCellsContainer';
import PlayerBox from '../Game/Components/PlayerBox';
import Dice from '../Game/Components/Dice';

// Constants
import {c} from '../Game/Utils/colors';
import styles from '../Game/Styles/styles';
import {P22, P35, P48, P9, SOCKET_API} from '../Game/Utils/constants';
import {BLUE, BOTTOM_VERTICAL, FOUR, GREEN, HOME, ONE, RED, THREE, TOP_VERTICAL, TWO, YELLOW, FINISHED} from '../Game/Utils/constants';

// Assets
import BG from '../Game/Assets/Backgrounds/GridBG.png';
import {useSelector, useDispatch} from 'react-redux';
import {selectUser} from '../Redux/Slices/AuthSlice';
import Popup from '../Components/Popup';
import {Button} from 'react-native-paper';
import {selectMoves, selectScore, selectScore2, selectTurn, setMoves, setScore, setTurn, setDiceNumber} from '../Redux/Slices/GameSlice';
import Sound from 'react-native-sound';

const socket = io(SOCKET_API);

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
export default function Game2({route, navigation}) {
	const {player1, player2, player3, player4, gameId, insertId, pawn, pawn2, bet} = route.params;

	const user = useSelector(selectUser);

	const roomId = '' + player1?.id;

	const dispatch = useDispatch();
	const moves = useSelector(selectMoves);
	const turn = useSelector(selectTurn);
	const score = useSelector(selectScore);
	const score2 = useSelector(selectScore2);

	const red = useRef(initPlayer(RED, c.red, player3, [{}, {}, {}, {}]));
	const green = useRef(initPlayer(GREEN, c.green, player2, pawn));
	const blue = useRef(initPlayer(BLUE, c.blue, player1, pawn2));
	const yellow = useRef(initPlayer(YELLOW, c.yellow, player4, [{}, {}, {}, {}]));
	const [disable, setDisable] = useState(false);

	const [resultPopup, setResultPopup] = useState(false);
	const [resultData, setResultData] = useState({});

	const [isRolling, setIsRolling] = useState(false);
	const [opponentDice, setOpponentDice] = useState(0);

	const [animateForSelection, setAnimateForSelection] = useState(false);
	const [isWaitingForRollDice, setIsWaitingForRollDice] = useState(true);

	const [prevData, setPrevData] = useState('');
	const pawnDisable = useRef(false);

	const prevPos = useRef({});
	const [testState, setTestState] = useState(true);
	const [key, setKey] = useState(0);
	const [timerRunning, setTimerRunning] = useState(true);

	useLayoutEffect(() => {
		dispatch(setScore({score: 0, score2: 0}));
		socket.emit('createRoom', roomId);

		socket.connect();
		return () => {
			socket.off('connect');
			socket.off('createRoom');
			socket.disconnect();
		};
	}, []);

	useEffect(() => {
		socket.on('diceRoll', data => {
			setAnimateForSelection(true);
			// setTimeout(() => {
			if (turn === BLUE) {
				setOpponentDice(data);
				diceAudio.play();
			} else {
				pawnDisable.current = false;
				dispatch(setMoves(data));
				dispatch(setDiceNumber(data));
				setIsRolling(false);
				setIsWaitingForRollDice(false);
			}
			setIsRolling(false);
			// }, 100);
			if (playerHasUnfinishedPieces(green.current).length === 1 && turn === GREEN) {
				movePieceByPosition(playerHasUnfinishedPieces(green.current)[0], data);
			}
		});

		return () => {
			socket.off('diceRoll');
		};
	}, [turn]);

	useEffect(() => {
		console.log(testState);
		socket.emit('joining', {
			room_id: player1.id + '',
			game_id: gameId,
		});

		socket.on('roomMessage', data => {
			if (data.typee === 'joining') {
				setTurn(data.turn);
			}
		});

		socket.on('pawnMove', async data => {
			// console.log(data, 'Green Screen');
			if (data.type === 'RETRY') {
				ToastAndroid.show('Retry', ToastAndroid.LONG);
				setPrevData('');
				setTimerRunning(false);
				setAnimateForSelection(true);
				pawnDisable.current = false;
				return;
			}
			if (data.type === 'SUCCESS' || data.type === 'REFRESH') {
				if (data.type === 'REFRESH') {
					ToastAndroid.show('Refreshing Done!', ToastAndroid.LONG);
				}
				data.opp_position.forEach(async item => {
					let player = item.color === 'blue' ? blue.current : green.current;

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

					if (piece.name === prevPos.current.name && piece.color === 'green' && data.user_id === user.id) {
						// setLatency(Date.now() - pawnMoveTime.current);
						// This Condition is only for Second User // This Will Move Pawn (Piece) From P52 to P1 //
						if (data.pawn_score > 25 && data.prev_score < 26) {
							let stepP = 25 - data.prev_score;
							let stepB = data.pawn_score - 25;
							if (stepP > 0) {
								let prevPosition = parseInt(prevPos.current.position.substring(1, prevPos.current.position.length));
								let newPosition = prevPosition + stepP;
								await new Promise((resolve, reject) => {
									resolve(movePawnByStep(prevPosition, newPosition, piece, 'P', null, item.position, data.sound));
								});
							} else if (stepB > 0) {
								let newPosition = stepB;
								await new Promise((resolve, reject) => {
									resolve(movePawnByStep(0, newPosition, piece, 'P'));
								});
							}
						} else if (data.pawn_score < 51) {
							let prevPosition = parseInt(prevPos.current.position.substring(1, prevPos.current.position.length));
							let newPosition = parseInt(item.position.substring(1, item.position.length));
							await movePawnByStep(prevPosition, newPosition, piece, 'P', null, null, data.sound);
						} else if (data.prev_score < 51 && data.pawn_score > 50) {
							let stepP = 50 - data.prev_score;
							let stepB = data.pawn_score - 50;
							if (stepP > 0) {
								let prevPosition = parseInt(prevPos.current.position.substring(1, prevPos.current.position.length));
								let newPosition = prevPosition + 1;
								await movePawnByStep(prevPosition, newPosition, piece, 'P', null, null, data.sound);
							}
							if (stepB > 0) {
								let newPosition = stepB;
								if (newPosition === 6) {
									await movePawnByStep(1, 5, piece, 'G', null, item.position);
								} else {
									await movePawnByStep(0, newPosition, piece, 'G', null, item.position);
								}
							}
						} else if (data.prev_score > 50 && data.pawn_score > 50) {
							let prevPosition = parseInt(prevPos.current.position.substring(1, prevPos.current.position.length));
							let newPosition = parseInt(item.position.substring(1, item.position.length));
							if (item.position === 'FINISHED') {
								await movePawn(piece, item.position);
							} else {
								await movePawnByStep(prevPosition, newPosition, piece, 'G');
							}
						}
					} else {
						movePawn(piece, item.position, data.sound);
					}
				});
				setDisable(false);
			}
			if (data.user_id === user.id) {
				dispatch(setScore({score: data.score, score2: data.score1}));
				setTestState(prev => !prev);
			} else {
				dispatch(setScore({score: data.score1, score2: data.score}));
				setTestState(prev => !prev);
			}
			if (data.turn === user.id) {
				dispatch(setTurn(GREEN));
				setOpponentDice(0);
				setKey(prev => prev + 1);
				setTimerRunning(true);
				setIsWaitingForRollDice(true);
			} else {
				dispatch(setTurn(BLUE));
				setOpponentDice(0);
				setKey(prev => prev + 1);
				setTimerRunning(true);
			}
			setDisable(false);

			if (data.type === 'FAILED') {
				setPrevData({});
				if (data.turn === user.id) {
					dispatch(setTurn(GREEN));
					setOpponentDice(0);
					setKey(prev => prev + 1);
					setTimerRunning(true);
					setTestState(prev => (prev === false ? true : false));
					setIsWaitingForRollDice(true);
				} else {
					dispatch(setTurn(BLUE));
					setOpponentDice(0);
					setKey(prev => prev + 1);
					setTimerRunning(true);
				}
				setDisable(false);
			}

			if (data.type === 'WIN') {
				if (data.game_id != gameId) {
					return;
				}
				if (data.game_status.user_id === user.id) {
					setResultData({title: 'Congratulations', message: 'You are Winner!', color: '#00ff00'});
					setResultPopup(true);
					winAudio.play();
				} else {
					setResultData({title: 'Sorry', message: 'Try Next Time!', color: '#ff0000'});
					setResultPopup(true);
					loseAudio.play();
				}
				setOpponentDice(0);
			}

			if (data.type === 'EXIT') {
				setTestState(prev => !prev);
				navigation.navigate('Home');
			}
			setTestState(prev => !prev);
		});

		BackHandler.addEventListener('hardwareBackPress', handleBackPress);

		return () => {
			socket.off('pawnMove');
			socket.disconnect();
			dispatch(setTurn(BLUE));
			BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
		};
	}, []);

	async function getNumber() {
		try {
			if (gameId) {
				diceRollTime.current = Date.now();
				socket.emit('diceRoll', {
					room_id: roomId,
					game_id: gameId,
					user_id: user.id,
				});
			}
		} catch (err) {
			console.log('Get Number', err);
		}
	}

	const handleBackPress = () => {
		Alert.alert('Hold on!', 'Are you sure you want to go back?', [
			{
				text: 'Cancel',
				onPress: () => null,
				style: 'cancel',
			},
			{text: 'Exit', onPress: handleUnsubscribe},
		]);
		return true;
	};

	async function handleUnsubscribe() {
		try {
			// console.log({
			// 	room_id: roomId,
			// 	id: insertId,
			// 	user_id: user.id,
			// 	game_id: gameId,
			// });
			socket.emit('exit', {
				room_id: roomId,
				id: insertId,
				user_id: user.id,
				game_id: gameId,
			});
		} catch (err) {
			console.log('Unsubscribe Error -', err);
		}
	}

	async function rollDice() {
		if (!isWaitingForRollDice || disable) {
			return;
		}
		setIsWaitingForRollDice(false);
		getNumber();
		diceAudio.play();
		setIsRolling(true);
	}

	function initPlayer(playerType, color, info, pawns) {
		return {
			pieces: initPieces(playerType, pawns),
			color: color,
			player: playerType,
			...info,
		};
	}

	function initPieces(playerColor, pawns) {
		let time = new Date().getTime();
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

	async function movePawnByStep(prevPosition, newPostion, piece, areaIndicator, finished = null, mv = null, sound) {
		// console.log('Prev Position =', prevPosition, 'New Position =', newPostion, 'Piece =', piece, 'Cell Area =', areaIndicator, '\n');
		piece.position = areaIndicator + ++prevPosition;
		piece.updateTime = new Date().getTime();
		setTestState(prev => !prev);
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
		}
		const timeOut = setTimeout(async () => {
			if (prevPosition < newPostion) {
				await movePawnByStep(prevPosition, newPostion, piece, areaIndicator, finished, mv);
				return;
			} else {
				if (mv !== null) {
					piece.position = mv;
					piece.updateTime = new Date().getTime();
					setTestState(prev => !prev);
					if (mv === FINISHED) {
						finishAudio.play();
					}
				}
				clearTimeout(timeOut);
				prevPos.current = {};
				return true;
			}
		}, 300);
		prevPos.current = {};
	}

	async function movePawn(pawn, position, sound) {
		pawn.position = position;
		pawn.updateTime = new Date().getTime();
		dispatch(setMoves(0));
		setAnimateForSelection(false);
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

	function movePieceByPosition(piece, move) {
		if (piece.color !== GREEN || pawnDisable.current) {
			return;
		}
		pawnDisable.current = true;
		prevPos.current = piece;
		if (!isWaitingForRollDice) {
			const data = {
				user_id: user.id,
				room_id: roomId,
				game_id: gameId,
				score: move,
				position: piece.position,
				pawn: piece.name === ONE ? 1 : piece.name === TWO ? 2 : piece.name === THREE ? 3 : piece.name === FOUR ? 4 : undefined,
			};
			let newData = JSON.stringify(data);
			if (prevData !== newData) {
				setDisable(true);
				setPrevData(newData);
				socket.emit('pawnMove', data);
				setAnimateForSelection(false);
				setTimerRunning(false);
			}
		}
	}

	function onPieceSelection(piece) {
		if (moves) {
			movePieceByPosition(piece, moves);
		}
	}

	function playerHasUnfinishedPieces(player) {
		const {one, two, three, four} = player.pieces;
		let countOfUnfinishedPieces = [];
		one.position !== FINISHED ? countOfUnfinishedPieces.push(one) : undefined;
		two.position !== FINISHED ? countOfUnfinishedPieces.push(two) : undefined;
		three.position !== FINISHED ? countOfUnfinishedPieces.push(three) : undefined;
		four.position !== FINISHED ? countOfUnfinishedPieces.push(four) : undefined;
		return countOfUnfinishedPieces;
	}

	function getFinishedPieces(player) {
		let finishedPieces = [];
		player.pieces.one.position === 'FINISHED' ? finishedPieces.push(player.pieces.one) : undefined;
		player.pieces.two.position === 'FINISHED' ? finishedPieces.push(player.pieces.two) : undefined;
		player.pieces.three.position === 'FINISHED' ? finishedPieces.push(player.pieces.three) : undefined;
		player.pieces.four.position === 'FINISHED' ? finishedPieces.push(player.pieces.four) : undefined;
		return finishedPieces;
	}

	return (
		<ImageBackground source={BG} style={styles.container}>
			<StatusBar translucent backgroundColor={'#ffffff00'} />
			<Popup color={'#fff'} title={resultData.title} visible={resultPopup} bg={resultData.color}>
				<Text style={{color: '#fff', fontSize: 18, textAlign: 'center'}}>{resultData.message}</Text>
				<Button mode='contained' color={'#FFD101'} style={{alignSelf: 'center', marginTop: '5%'}} onPress={() => navigation.navigate('Home')}>
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
				<Text style={{color: '#fff', fontWeight: 'bold', fontSize: 14}}>Prize: {bet}</Text>
				<Text
					style={{
						fontSize: 18,
						fontWeight: 'bold',
						color: '#fff',
					}}>
					{gameId}
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
			{/* <Text
				style={{
					fontSize: 18,
					fontWeight: 'bold',
					position: 'absolute',
					color: '#fff',
					top: StatusBar.currentHeight + 10,
				}}>
				{gameId}
			</Text> */}
			{/* <View style={{position: 'absolute', top: StatusBar.currentHeight + 10, right: 10, flexDirection: 'row', alignItems: 'center'}}>
				<Icon
					name={
						latency > 1000 ? 'wifi-strength-1' : latency > 700 ? 'wifi-strength-2' : latency > 400 ? 'wifi-strength-3' : latency > 100 ? 'wifi-strength-4' : undefined
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
			<View style={styles.board}>
				<View style={styles.playerSection}>
					<PlayerBox player={red.current} currentUser={GREEN} />
					<VerticalCellsContainer
						position={TOP_VERTICAL}
						game2
						onPieceSelection={onPieceSelection}
						pieces={{red: red.current, green: green.current, blue: blue.current, yellow: yellow.current}}
						animateForSelection={animateForSelection}
					/>
					<PlayerBox player={blue.current} score={score2} diceNumber={opponentDice} currentUser={GREEN} />
				</View>
				<HorizontalCellsContainer
					pieces={{red: red.current, green: green.current, blue: blue.current, yellow: yellow.current}}
					game2
					animateForSelection={animateForSelection}
					blueFinished={getFinishedPieces(blue.current)}
					greenFinished={getFinishedPieces(green.current)}
					onPieceSelection={onPieceSelection}
				/>
				<View style={styles.playerSection}>
					<PlayerBox player={green.current} score={score} currentUser={GREEN} />
					<VerticalCellsContainer
						position={BOTTOM_VERTICAL}
						game2
						onPieceSelection={onPieceSelection}
						pieces={{red: red.current, green: green.current, blue: blue.current, yellow: yellow.current}}
						animateForSelection={animateForSelection}
					/>
					<PlayerBox player={yellow.current} currentUser={GREEN} />
				</View>
			</View>
			<Dice
				onDiceRoll={rollDice}
				timerRunning={timerRunning}
				// onComplete={handleUnsubscribe}
				onComplete={() => {
					if (turn === GREEN) {
						setTimeout(handleUnsubscribe, 5000);
					} else {
						setTimeout(handleUnsubscribe, 10000);
					}
				}}
				timerKey={key}
				isRolling={isRolling}
				currentUser={GREEN}
				isWaitingForRollDice={isWaitingForRollDice}
			/>
		</ImageBackground>
	);
}
