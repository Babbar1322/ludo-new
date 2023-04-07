import React, {useEffect, useState, useRef} from 'react';
import {ImageBackground, StatusBar, Text, ToastAndroid, Vibration, View} from 'react-native';
import socket from '../Game/Components/Socket';

import {BLUE, FINISHED, FOUR, GREEN, ONE, RED, THREE, TWO, YELLOW} from '../Game/Utils/constants';
import {B, Constants, G, P} from '../Game/Utils/positions';
import BG from '../Game/Assets/Backgrounds/GridBG.png';
import styles from '../Game/Styles/styles';

import VerticalCellContainer from '../Game/Components/VerticalCellsContainer';
import HorizontalCellContainer from '../Game/Components/HorizontalCellsContainer';
import Center from '../Game/Components/Center';
import PlayerBox from '../Game/Components/PlayerBox';
import Piece from '../Game/Components/Piece';
import Dice from '../Game/Components/Dice';
import TopRow from '../Game/Components/TopRow';

import {CutAudio, DiceAudio, FinishAudio, LoseAudio, SafeAudio, WinAudio} from '../Game/Components/Sounds';
import Popup from '../Components/Popup';
import {Button} from 'react-native-paper';

export default function Game({route, navigation}) {
	const {player1, player2, gameId, user, bet, insertId} = route.params;
	const players = useRef([
		{
			color: BLUE,
			score: 0,
			user: player1,
		},
		{
			color: GREEN,
			score: 0,
			user: player2,
		},
		{
			color: RED,
			score: 0,
			user: {},
		},
		{
			color: YELLOW,
			score: 0,
			user: {},
		},
	]);
	const pieces = useRef([
		{
			name: ONE,
			color: BLUE,
			animateForSelection: false,
			position: P[1],
			score: 0,
		},
		{
			name: TWO,
			color: BLUE,
			animateForSelection: false,
			position: P[1],
			score: 0,
		},
		{
			name: THREE,
			color: BLUE,
			animateForSelection: false,
			position: P[1],
			score: 0,
		},
		{
			name: FOUR,
			color: BLUE,
			animateForSelection: false,
			position: P[1],
			score: 0,
		},
		{
			name: ONE,
			color: GREEN,
			animateForSelection: false,
			position: P[27],
			score: 0,
		},
		{
			name: TWO,
			color: GREEN,
			animateForSelection: false,
			position: P[27],
			score: 0,
		},
		{
			name: THREE,
			color: GREEN,
			animateForSelection: false,
			position: P[27],
			score: 0,
		},
		{
			name: FOUR,
			color: GREEN,
			animateForSelection: false,
			position: P[27],
			score: 0,
		},
	]);
	const turn = useRef(BLUE);
	const diceNumber = useRef(0);
	const opponentDice = useRef(0);
	const isRolling = useRef(false);
	// const [isWaitingForRollDice, setIsWaitingForRollDice] = useState(true);
	const isWaitingForRollDice = useRef(true);
	const [update, setUpdate] = useState(true);
	const [ping, setPing] = useState(0);
	const [popupData, setPopupData] = useState({
		show: false,
		title: '',
		message: '',
		bg: '',
	});
	const [timerRunning, setTimerRunning] = useState(true);

	const disableInput = useRef(false);
	const pingTime = useRef(0);
	const timerKey = useRef(0);

	const roomId = '' + player1.id;

	const updateState = () => {
		setUpdate(prev => !prev);
	};

	const isMovePossibleForPiece = piece => {
		const position = piece.position[2];
		let isMovePossible = false;
		let positionCheckFor = Number(position.substring(1, position.length));
		let positionArea = position.substring(0, 1);
		let possiblePosition = diceNumber.current + positionCheckFor;
		if ((positionArea === 'B' || positionArea === 'G') && possiblePosition > 6) {
			isMovePossible = false;
		} else {
			isMovePossible = true;
		}
		console.log('isMovePossible', isMovePossible);
		return isMovePossible;
	};

	const checkAutoMove = move => {
		const availablePieces = pieces.current.filter(piece => Number(piece.score) + move <= 56 && piece.color === BLUE);
		if (availablePieces.length === 1) {
			onPieceTouch(availablePieces[0]);
		} else if (availablePieces.length <= 0) {
			onPieceTouch(pieces[0]);
		}
	};

	const rollDice = () => {
		if (!isWaitingForRollDice.current) {
			return;
		}
		isRolling.current = true;
		// const randomNumber = Math.floor(Math.random() * (6 - 1 + 1)) + 1;
		updateState();
		DiceAudio.play();
		socket.emit('diceRoll', {
			room_id: roomId,
			user_id: user.id,
		});
	};

	const onPieceTouch = async piece => {
		if (!diceNumber.current || turn.current !== BLUE || piece.color !== BLUE || isWaitingForRollDice.current || disableInput.current) {
			// console.log(diceNumber.current, turn.current, piece.color, isWaitingForRollDice.current);
			return;
		}
		disableInput.current = true;
		updateState();
		socket.emit('pawnMove', {
			room_id: roomId,
			game_id: gameId,
			user_id: user.id,
			pawn: piece.name,
			score: diceNumber.current,
		});
	};

	const movePiece = async (piece, startPosition, endPosition, cell) => {
		for (let i = startPosition; i <= endPosition || startPosition !== 52; i++) {
			if (startPosition != i) {
				await new Promise(resolve => {
					setTimeout(() => {
						// console.log('Inside the loop');
						piece.position = cell[i];
						// if (piece.color === GREEN) {
						// 	console.log(piece.position);
						// }
						resolve();
						updateState();
					}, 150);
				});
				updateState();
			} else {
				piece.position = cell[i];
				// console.log(piece.position);
				updateState();
			}
			if (cell[i][2] === 'B6' || cell[i][2] === 'G6') {
				FinishAudio.play();
			}
			if (i === endPosition && (i === 9 || i === 22 || i === 35 || i === 48)) {
				console.log('Safe', endPosition);
				SafeAudio.play();
			}
			if (i >= endPosition) {
				return 'Completed';
			}
		}
	};
	const cutPiece = piece => {
		if (piece.color === BLUE) {
			piece.position = P[1];
		} else {
			piece.position = P[27];
		}
		CutAudio.play();
		Vibration.vibrate(300);
		piece.score = 0;
		updateState();
	};

	const handleUnsubscribe = () => {
		socket.emit('exit', {
			room_id: roomId,
			id: insertId,
			user_id: user.id,
			game_id: gameId,
		});
	};

	useEffect(() => {
		socket.emit('pong');
		socket.emit('clearRooms', roomId);
		socket.on('clearSuccess', data => {
			socket.emit('createRoom', roomId);
		});
		// socket.on('roomsList', data => {
		// 	console.log(data);
		// });
		socket.on('ping', data => {
			// console.log('Ping Game 1', data);
			setPing(Date.now() - pingTime.current);
			setTimeout(() => {
				socket.emit('pong', 'game1');
				pingTime.current = Date.now();
			}, 500);
		});
		socket.on('diceRoll', data => {
			// console.log('Dice Roll Data Game 1', data);
			if (turn.current === BLUE) {
				diceNumber.current = data;
				pieces.current.map(piece => {
					if (piece.color === BLUE && isMovePossibleForPiece(piece)) {
						piece.animateForSelection = true;
					} else {
						piece.animateForSelection = false;
					}
				});
				isWaitingForRollDice.current = false;
				isRolling.current = false;
				disableInput.current = false;
				checkAutoMove(data);
				updateState();
			} else {
				DiceAudio.play();
				opponentDice.current = data;
				pieces.current.map(piece => {
					piece.animateForSelection = false;
				});
				isWaitingForRollDice.current = false;
				disableInput.current = true;
			}
			updateState();
		});
		socket.on('pawnMove', data => {
			console.log('Pawn Move Data Game 1', data);
			if (data.type === 'RETRY') {
				ToastAndroid.show('Retry', ToastAndroid.LONG);
				disableInput.current = false;
				return;
			}
			if (data.type === 'SUCCESS') {
				data.opp_position.forEach(async item => {
					const player = players.current.find(player => player.color === item.color);
					const piece = pieces.current.find(piece => piece.name === item.pawn && piece.color === player.color);

					piece.score = item.score;

					if (piece.color === BLUE && data.user_id === user.id) {
						const prevPos = piece.position[2];
						if (data.pawn_score < 51) {
							console.log('Blue Screen 1 if');
							let prevPosition = Number(prevPos.substring(1, prevPos.length));
							let newPosition = Number(item.position.substring(1, item.position.length));
							await movePiece(piece, prevPosition, newPosition, P);
						} else if (data.prev_score < 51 && data.pawn_score > 50) {
							console.log('Blue Screen 2 else if');
							let stepP = 50 - data.prev_score;
							let stepB = data.pawn_score - 50;
							if (stepP > 0) {
								console.log('Blue Screen 2 else if --- 1 if');
								let prevPosition = Number(prevPos.substring(1, prevPos.length));
								let newPosition = prevPosition + stepP;
								console.log('prevPosition', prevPosition, 'newPosition', newPosition);
								await movePiece(piece, prevPosition, newPosition, P).then(res => {
									if (res === 'Completed' && stepB > 0) {
										console.log('Blue Screen 2 else if --- 1 if --- 1 if');
										setTimeout(async () => {
											await movePiece(piece, 1, stepB, B);
										}, 150);
									}
								});
							}
							if (!stepP > 0 && stepB > 0) {
								console.log('Blue Screen 2 else if --- 1 if --- 2 if');
								let newPosition = stepB;
								// await movePiece(piece, 1, newPosition, B);
								if (item.position === FINISHED) {
									await movePiece(piece, 1, 6, B);
								} else {
									await movePiece(piece, 1, newPosition, B);
								}
							}
						} else if (data.prev_score > 50 && data.pawn_score > 50) {
							console.log('Blue Screen 3 else if');
							// console.log('aaaaaaaaa');
							let prevPosition = Number(prevPos.substring(1, prevPos.length));
							let newPosition = Number(item.position.substring(1, item.position.length));
							// await movePiece(piece, prevPosition, newPosition, B);
							if (item.position === FINISHED) {
								await movePiece(piece, prevPosition, 6, B);
							} else {
								await movePiece(piece, prevPosition, newPosition, B);
							}
						}
					} else if (piece.position[2] !== item.position && item.color !== BLUE) {
						let prevPos = piece.position[2];
						// console.log('Piece 2', prevPos);
						if (data.sound === 'pawncut' && item.score == 0) {
							cutPiece(piece);
						} else if (data.pawn_score > 25 && data.prev_score < 26) {
							console.log('Blue Screen for Green 1 if');
							// console.log('1111111111');
							let stepP = 25 - data.prev_score;
							let stepB = data.pawn_score - 25;
							// console.log(stepP, stepB);
							if (stepP > 0) {
								console.log('Blue Screen for Green 1 if --- 1 if');
								// console.log('pppppp', Date.now());
								let prevPosition = Number(prevPos.substring(1, prevPos.length));
								let newPosition = prevPosition + stepP;
								await movePiece(piece, prevPosition, newPosition, P).then(res => {
									if (res === 'Completed' && stepB > 0) {
										console.log('Blue Screen for Green 1 if --- 1 if --- 1 if');
										setTimeout(() => {
											movePiece(piece, 1, stepB, P);
										}, 150);
									}
								});
							}
							if (!stepP > 0 && stepB > 0) {
								console.log('Green Screen 1 if --- 1 if --- 2 if');
								setTimeout(() => {
									movePiece(piece, 1, stepB, P);
								}, 150);
							}
							// else if (stepB > 0) {
							// 	// console.log('bbbbbb', Date.now());
							// 	let newPosition = stepB;
							// 	await new Promise((resolve, reject) => {
							// 		resolve(this.movePawnByStepSecond(0, newPosition, piece, 'P'));
							// 	});
							// }
						} else if (data.pawn_score < 51) {
							console.log('Blue Screen for Green 2 else if');
							let prevPosition = Number(prevPos.substring(1, prevPos.length));
							let newPosition = Number(item.position.substring(1, item.position.length));
							await movePiece(piece, prevPosition, newPosition, P);
						} else if (data.prev_score < 51 && data.pawn_score > 50) {
							console.log('Blue Screen for Green 3 else if');
							let stepP = 50 - data.prev_score;
							let stepB = data.pawn_score - 50;
							if (stepP > 0) {
								console.log('Blue Screen for Green 3 else if --- 1 if');
								let prevPosition = Number(prevPos.substring(1, prevPos.length));
								let newPosition = prevPosition + stepP;
								await movePiece(piece, prevPosition, newPosition, P).then(res => {
									if (res === 'Completed' && stepB > 0) {
										console.log('Blue Screen for Green 3 else if --- 1 if --- 2 if');
										setTimeout(() => {
											movePiece(piece, 1, stepB, G);
										}, 150);
									}
								});
							}
							if (!stepP > 0 && stepB > 0) {
								console.log('Blue Screen for Green 3 else if --- 1 if --- 1 if');
								let newPosition = stepB;
								// await movePiece(piece, 1, newPosition, P);
								if (newPosition === 6) {
									console.log('Blue Screen for Green 3 else if --- 1 if --- 1 if --- 1 if');
									setTimeout(() => {
										movePiece(piece, 1, 6, G);
									}, 150);
								} else {
									console.log('Blue Screen for Green 3 else if --- 1 if --- 1 if --- 2 if');
									setTimeout(() => {
										movePiece(piece, 1, newPosition, G);
									}, 150);
								}
							}
						} else if (data.prev_score > 50 && data.pawn_score > 50) {
							console.log('Blue Screen for Green 4 else if');
							let prevPosition = Number(prevPos.substring(1, prevPos.length));
							let newPosition = Number(item.position.substring(1, item.position.length));
							// await movePiece(piece, prevPosition, newPosition, G, FINISHED);
							if (item.position === FINISHED) {
								await movePiece(piece, prevPosition, 6, G, FINISHED);
							} else {
								await movePiece(piece, prevPosition, newPosition, G);
							}
						}
					}
					if (data.sound === 'pawncut' && item.score == 0) {
						cutPiece(piece);
					}
					// if (data.sound === 'pawncut' && item.color === BLUE && data.user_id !== user.id) {
					// 	cutPiece(piece);
					// } else if (data.sound === 'pawncut' && item.color === GREEN && data.user_id === user.id) {
					// 	cutPiece(piece);
					// }
				});
				if (data.turn === user.id) {
					turn.current = BLUE;
					isWaitingForRollDice.current = true;
					opponentDice.current = 0;
					timerKey.current += 1;
				} else {
					turn.current = GREEN;
					opponentDice.current = 0;
					timerKey.current += 1;
				}
				pieces.current.map(item => {
					item.animateForSelection = false;
				});
				updateState();
				if (data.user_id === user.id) {
					players.current.map(player => {
						if (player.color === BLUE) {
							player.score = data.score;
						}
						if (player.color === GREEN) {
							player.score = data.score1;
						}
					});
				} else {
					players.current.map(player => {
						if (player.color === BLUE) {
							player.score = data.score1;
						}
						if (player.color === GREEN) {
							player.score = data.score;
						}
					});
				}
				updateState();
			}
			if (data.type === 'FAILED') {
				if (data.turn === user.id) {
					turn.current = BLUE;
					isWaitingForRollDice.current = true;
					opponentDice.current = 0;
					timerKey.current += 1;
					updateState();
					// this.setState(prev => ({turn: BLUE, opponentDice: 0, key: prev.key + 1, timerRunning: true, isWaitingForRollDice: true, prevData: {}, disable: false}));
				} else {
					turn.current = GREEN;
					opponentDice.current = 0;
					timerKey.current += 1;
					updateState();
					// this.setState(prev => ({turn: GREEN, setOpponentDice: 0, key: prev.key + 1, timerRunning: true, prevData: {}, disable: false}));
				}
			}

			if (data.type === 'WIN') {
				if (data.game_status.user_id === user.id) {
					setPopupData({show: true, title: 'Congratulations', message: 'You are Winner!', bg: '#00ff00'});
					// this.setState({resultData: {title: 'Congratulations', message: 'You are Winner!', color: '#00ff00'}, resultPopup: true, opponentDice: 0});
					WinAudio.play();
				} else {
					setPopupData({show: true, title: 'Sorry', message: 'Try Next Time!', bg: '#ff0000'});
					// this.setState({resultData: {title: 'Sorry', message: 'Try Next Time!', color: '#ff0000'}, resultPopup: true, opponentDice: 0});
					LoseAudio.play();
				}
				setTimerRunning(false);
			}
			if (data.type === 'EXIT') {
				navigation.navigate('Home');
			}
			updateState();
		});
		console.log(update);
		return () => {
			socket.off();
		};
	}, []);
	return (
		<ImageBackground source={BG} style={styles.container}>
			<StatusBar translucent />
			<Popup color={'#fff'} bg={popupData.bg} title={popupData.title} visible={popupData.show}>
				<Text style={{color: '#fff', fontSize: 18, textAlign: 'center'}}>{popupData.message}</Text>
				<Button mode="contained" color={'#FFD101'} style={{alignSelf: 'center', marginTop: '5%'}} onPress={() => navigation.navigate('Home')}>
					Exit
				</Button>
			</Popup>
			<TopRow ping={ping} bet={bet} gameId={gameId} openSettings={() => navigation.navigate('Settings')} />
			<View style={styles.board}>
				{players.current.map((player, idx) => (
					<PlayerBox score={player.score} diceNumber={opponentDice.current} turn={turn.current} currentUser={BLUE} player={player} key={idx} />
				))}
				<VerticalCellContainer positions={'top'} />
				<VerticalCellContainer positions={'bottom'} />
				<HorizontalCellContainer positions={'left'} />
				<HorizontalCellContainer positions={'right'} />
				<Center />
				{pieces.current.map((piece, idx) => (
					<Piece
						name={piece.name}
						currentUser={BLUE}
						color={piece.color}
						position={piece.position}
						onTouch={() => onPieceTouch(piece)}
						size={Constants.CELL_SIZE}
						animateForSelection={piece.animateForSelection}
						key={idx}
					/>
				))}
			</View>
			<Dice
				currentUser={BLUE}
				diceNumber={diceNumber.current}
				isRolling={isRolling.current}
				isWaitingForRollDice={isWaitingForRollDice.current}
				onDiceRoll={rollDice}
				turn={turn.current}
				timerKey={timerKey.current}
				timerRunning={timerRunning}
				onComplete={() => {
					if (turn === BLUE) {
						setTimeout(handleUnsubscribe, 5000);
					} else {
						setTimeout(handleUnsubscribe, 10000);
					}
				}}
			/>
		</ImageBackground>
	);
}
