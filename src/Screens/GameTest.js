import React, {useEffect, useRef, useLayoutEffect} from 'react';
import {View, Text, ImageBackground, ToastAndroid} from 'react-native';
import io from 'socket.io-client';
import {useSelector} from 'react-redux';

import {BLUE, BOTTOM_VERTICAL, FINISHED, FOUR, GREEN, ONE, RED, SOCKET_API, THREE, TOP_VERTICAL, TWO, YELLOW} from '../Game/Utils/constants';
import {selectUser} from '../Redux/Slices/AuthSlice';
import {c} from '../Game/Utils/colors';

import BG from '../Assets/Images/GridBG.png';
import styles from '../Game/Styles/styles';
import Popup from '../Components/Popup';
import {Button} from 'react-native-paper';
import PlayerBox from '../Game/Components/PlayerBox';
import HorizontalCellsContainer from '../Game/Components/HorizontalCellsContainer';
import VerticalCellsContainer from '../Game/Components/VerticalCellsContainer';
import Dice from '../Game/Components/Dice';

const socket = io(SOCKET_API);
export default function GameTest({route, navigation}) {
	const {player1, player2, player3, player4, insertedId, gameId, pawn, pawn2} = route.params;
	const user = useSelector(selectUser);
	const room_id = '' + user?.id;

	const score = useRef(0);
	const score2 = useRef(0);

	const red = useRef(initPlayer(RED, c.red, player3, [{}, {}, {}, {}]));
	const green = useRef(initPlayer(GREEN, c.green, player2, pawn));
	const blue = useRef(initPlayer(BLUE, c.blue, player1, pawn2));
	const yellow = useRef(initPlayer(YELLOW, c.yellow, player4, [{}, {}, {}, {}]));

	const opponentDice = useRef(0);
	const isRolling = useRef(false);
	const isWaitingForRollDice = useRef(true);
	const disable = useRef(false);
	const animateForSelection = useRef(false);
	const turn = useRef(BLUE);
	const moves = useRef(0);
	const diceNumber = useRef(0);

	const resultPopup = useRef(false);
	const resultData = useRef({});

	const prevPos = useRef({});

	useLayoutEffect(() => {
		socket.emit('createRoom', room_id);

		socket.connect();
		return () => {
			socket.off('createRoom');
			// socket.disconnect();
		};
	}, []);

	useEffect(() => {
		socket.on('diceRoll', data => {
			// console.log(data);
			animateForSelection.current = true;

			setTimeout(() => {
				if (turn.current === GREEN) {
					opponentDice.current = data;
				} else {
					moves.current = data;
					diceNumber.current = data;
					opponentDice.current = 0;
					isRolling.current = false;
					isWaitingForRollDice.current = false;
				}
			}, 100);
			if (playerHasUnfinishedPieces(blue.current).length === 1 && turn === BLUE) {
				movePieceByPosition(playerHasUnfinishedPieces(blue.current)[0], data);
			}
		});

		// socket.on('pawnMove', data => {
		//     if(data.type === 'SUCCESS' || data.type === 'REFRESH'){
		//         if(data.user_id === user.id) {
		//             let piece = data.pawn
		//         }
		//     }
		// })
		socket.on('pawnMove', data => {
			if (data.type === 'SUCCESS' || data.type === 'REFRESH') {
				if (data.type === 'REFRESH') {
					ToastAndroid.show('Refreshing Done!', ToastAndroid.LONG);
				}
				data.opp_position.forEach(async item => {
					let player = item.color === BLUE ? blue.current : green.current;

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
					if (piece.name === prevPos.current.name && piece.color === BLUE && data.user_id === user.id) {
						if (data.pawn_score < 51) {
							// console.log(111111111111111111111111111111111111111111111111111111111111111);
							let prevPosition = parseInt(prevPos.current.position.substring(1, prevPos.current.position.length));
							let newPosition = parseInt(item.position.substring(1, item.position.length));
							await movePawnByStep(prevPosition, newPosition, piece, 'P');
						} else if (data.prev_score < 51 && data.pawn_score > 50) {
							// console.log(2222222222222222222222222222222222222222222222222222222222222);
							let stepP = 50 - data.prev_score;
							let stepB = data.pawn_score - 50;
							if (stepP > 0) {
								let prevPosition = parseInt(prevPos.current.position.substring(1, prevPos.current.position.length));
								let newPosition = prevPosition + 1;
								await movePawnByStep(prevPosition, newPosition, piece, 'P');
							}
							if (stepB > 0) {
								// let prevPosition = parseInt(prevPos.current.position.substring(1, prevPos.current.position.length));
								let newPosition = stepB;
								await movePawnByStep(1, newPosition, piece, 'B');
							}
						} else if (data.prev_score > 50 && data.pawn_score > 50) {
							// console.log(333333333333333333333333333333333333333333333333);
							let prevPosition = parseInt(prevPos.current.position.substring(1, prevPos.current.position.length));
							let newPosition = parseInt(item.position.substring(1, item.position.length));
							if (item.position === 'FINISHED') {
								movePawn(piece, item.position);
							} else {
								await movePawnByStep(prevPosition, newPosition, piece, 'B');
							}
						}
						// let prevPosition = parseInt(prevPos.current.position.substring(1, prevPos.current.position.length));
						// let newPosition = parseInt(item.position.substring(1, item.position.length));
						// movePawnByStep(prevPosition, newPosition, piece);
					} else {
						movePawn(piece, item.position);
					}

					disable.current = false;
				});
				if (data.user_id === user.id) {
					score.current = data.score;
					score2.current = data.score1;
					// dispatch(setScore({score: data.score, score2: data.score1}));
				} else {
					score.current = data.score1;
					score2.current = data.score;
					// dispatch(setScore({score: data.score1, score2: data.score}));
				}
				if (data.turn === user.id) {
					turn.current = BLUE;
					opponentDice.current = 0;
					isWaitingForRollDice.current = true;
				} else {
					turn.current = GREEN;
					opponentDice.current = 0;
				}
				disable.current = false;
			}

			if (data.type === 'FAILED') {
				if (data.turn === user.id) {
					turn.current = BLUE;
					isWaitingForRollDice.current = true;
				} else {
					turn.current = GREEN;
				}
				opponentDice.current = 0;
				disable.current = false;
			}

			if (data.type === 'WIN') {
				if (data.game_status.user_id === user.id) {
					resultData.current = {title: 'Congratulations', message: 'You are Winner!', color: '#00ff00'};
					resultPopup.current = true;
				} else {
					resultData.current = {title: 'Sorry', message: 'Try Next Time!', color: '#ff0000'};
					resultPopup.current = true;
				}
				turn.current = BLUE;
				opponentDice.current = 0;
			}

			if (data.type === 'EXIT') {
				turn.current = BLUE;
				navigation.navigate('Home');
			}

			if (data.type === 'RETRY') {
				ToastAndroid.show('Retry', ToastAndroid.LONG);
				if (data.turn === user.id) {
					console.log('Retry If Condition');
				}
			}
		});

		return () => {
			socket.off('diceRoll');
			socket.off('pawnMove');
			// socket.disconnect();
		};
	}, []);

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

	async function rollDice() {
		if (!isWaitingForRollDice || disable) {
			return;
		}
		isWaitingForRollDice.current = false;
		isRolling.current = true;
		socket.emit('diceRoll', {
			room_id,
			game_id: gameId,
			user_id: user.id,
		});
	}

	async function movePawnByStep(prevPosition, newPostion, piece, areaIndicator, finished = null) {
		piece.position = areaIndicator + ++prevPosition;
		piece.updateTime = new Date().getTime();
		const timeOut = setTimeout(async () => {
			if (prevPosition < newPostion) {
				await movePawnByStep(prevPosition, newPostion, piece, areaIndicator, finished);
			} else {
				clearTimeout(timeOut);
			}
		}, 50);

		prevPos.current = {};
	}

	function movePawn(pawn, position) {
		pawn.position = position;
		pawn.updateTime = new Date().getTime();
		moves.current = 0;
		animateForSelection.current = false;
	}

	function movePieceByPosition(piece, move) {
		if (piece.color !== BLUE || isWaitingForRollDice.current) {
			return;
		}
		prevPos.current = piece;
		if (!moves.current || !isWaitingForRollDice.current) {
			disable.current = true;
			socket.emit('pawnMove', {
				user_id: user.id,
				room_id,
				game_id: gameId,
				score: move,
				pawn: piece.name === ONE ? 1 : piece.name === TWO ? 2 : piece.name === THREE ? 3 : piece.name === FOUR ? 4 : undefined,
			});
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
		player.pieces.one.position === FINISHED ? finishedPieces.push(player.pieces.one) : undefined;
		player.pieces.two.position === FINISHED ? finishedPieces.push(player.pieces.two) : undefined;
		player.pieces.three.position === FINISHED ? finishedPieces.push(player.pieces.three) : undefined;
		player.pieces.four.position === FINISHED ? finishedPieces.push(player.pieces.four) : undefined;
		return finishedPieces;
	}

	return (
		<ImageBackground source={BG} style={styles.container}>
			<Popup color={'#fff'} title={resultData.current.title} visible={resultPopup.current} bg={resultData.current.color}>
				<Text style={{color: '#fff', fontSize: 18, textAlign: 'center'}}>{resultData.current.message}</Text>
				<Button mode='contained' color={'#FFD101'} style={{alignSelf: 'center', marginTop: '5%'}} onPress={() => navigation.navigate('Home')}>
					Exit
				</Button>
			</Popup>

			<View style={styles.board}>
				<View style={styles.playerSection}>
					<PlayerBox player={red.current} currentUser={BLUE} turn={turn.current} />
					<VerticalCellsContainer
						position={TOP_VERTICAL}
						turn={turn.current}
						onPieceSelection={movePieceByPosition}
						pieces={{red: red.current, green: green.current, blue: blue.current, yellow: yellow.current}}
						animateForSelection={animateForSelection.current}
					/>
					<PlayerBox player={green.current} score={score2.current} currentUser={BLUE} diceNumber={opponentDice.current} turn={turn.current} />
				</View>
				<HorizontalCellsContainer
					pieces={{red: red.current, green: green.current, blue: blue.current, yellow: yellow.current}}
					blueFinished={getFinishedPieces(blue.current)}
					greenFinished={getFinishedPieces(green.current)}
					onPieceSelection={movePieceByPosition}
					animateForSelection={animateForSelection.current}
					turn={turn.current}
				/>
				<View style={styles.playerSection}>
					<PlayerBox player={blue.current} score={score.current} currentUser={BLUE} turn={turn.current} />
					<VerticalCellsContainer
						position={BOTTOM_VERTICAL}
						turn={turn.current}
						onPieceSelection={movePieceByPosition}
						pieces={{red: red.current, green: green.current, blue: blue.current, yellow: yellow.current}}
						animateForSelection={animateForSelection.current}
					/>
					<PlayerBox player={yellow.current} currentUser={BLUE} turn={turn.current} />
				</View>
			</View>
			<Dice onDiceRoll={rollDice} isRolling={isRolling.current} currentUser={BLUE} turn={turn.current} />
		</ImageBackground>
	);
}
