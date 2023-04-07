// import React, {Component} from 'react';
// import {Alert, BackHandler, ImageBackground, StatusBar, Text, ToastAndroid, TouchableOpacity, View, Vibration} from 'react-native';
// import {Button, IconButton} from 'react-native-paper';
// import io from 'socket.io-client';
// import NetInfo from '@react-native-community/netinfo';
// import {Icon} from 'react-native-elements';

// import styles from '../Game/Styles/styles';
// import {c} from '../Game/Utils/colors';
// import BG from '../Game/Assets/Backgrounds/GridBG.png';
// import Popup from '../Components/Popup';
// import Dice from '../Game/Components/Dice';
// import {SW} from '../Config/Config';
// import {Constants, P, B, G} from '../Game/Utils/positions';
// import PlayerBox from '../Game/Components/PlayerBox';
// import VerticalCellContainer from '../Game/Components/VerticalCellsContainer';
// import HorizontalCellContainer from '../Game/Components/HorizontalCellsContainer';
// import Center from '../Game/Components/Center';
// import Piece from '../Game/Components/Piece';
// import TopRow from '../Game/Components/TopRow';
// import {BLUE, FINISHED, FOUR, GREEN, ONE, RED, THREE, TWO, YELLOW} from '../Game/Utils/constants';
// import {DiceAudio} from '../Game/Components/Sounds';
// import socket from '../Game/Components/Socket';

// export default class Blue extends Component {
// 	constructor(props) {
// 		super(props);
// 		const {player1, player2, player3, player4, user} = this.props.route.params;
// 		this.state = {
// 			pieces: [
// 				{
// 					position: P[1],
// 					size: Constants.CELL_SIZE,
// 					color: BLUE,
// 					animateForSelection: true,
// 					name: ONE,
// 				},
// 				{
// 					position: P[1],
// 					size: Constants.CELL_SIZE,
// 					color: BLUE,
// 					animateForSelection: false,
// 					name: TWO,
// 				},
// 				{
// 					position: P[1],
// 					size: Constants.CELL_SIZE,
// 					color: BLUE,
// 					animateForSelection: false,
// 					name: THREE,
// 				},
// 				{
// 					position: P[1],
// 					size: Constants.CELL_SIZE,
// 					color: BLUE,
// 					animateForSelection: false,
// 					name: FOUR,
// 				},
// 				{
// 					position: P[27],
// 					size: Constants.CELL_SIZE,
// 					color: GREEN,
// 					animateForSelection: false,
// 					name: ONE,
// 				},
// 				{
// 					position: P[27],
// 					size: Constants.CELL_SIZE,
// 					color: GREEN,
// 					animateForSelection: false,
// 					name: TWO,
// 				},
// 				{
// 					position: P[27],
// 					size: Constants.CELL_SIZE,
// 					color: GREEN,
// 					animateForSelection: false,
// 					name: THREE,
// 				},
// 				{
// 					position: P[27],
// 					size: Constants.CELL_SIZE,
// 					color: GREEN,
// 					animateForSelection: false,
// 					name: FOUR,
// 				},
// 			],
// 			players: [
// 				{
// 					color: BLUE,
// 					user: player1,
// 					score: 0,
// 				},
// 				{
// 					color: GREEN,
// 					user: player2,
// 					score: 1,
// 				},
// 				{
// 					color: YELLOW,
// 					user: player3,
// 					score: 0,
// 				},
// 				{
// 					color: RED,
// 					user: player4,
// 					score: 0,
// 				},
// 			],
// 			turn: BLUE,
// 			diceNumber: 5,
// 			isWaitingForRollDice: true,
// 			isRolling: false,
// 			timerRunning: false,
// 			key: 1,
// 		};

// 		this.disableInput = false;
// 		this.roomId = '' + user.id;

// 		this.rollDice = this.rollDice.bind(this);
// 		this.onPieceTouch = this.onPieceTouch.bind(this);
// 	}

// 	componentDidMount() {
// 		const {pieces, turn, players} = this.state;
// 		const {user} = this.props.route.params;
// 		// Dice Roll Socket Event Listener
// 		socket.on('diceRoll', data => {
// 			// console.log(data, 'Dice Roll Data');
// 			setTimeout(() => {
// 				if (turn === GREEN) {
// 					DiceAudio.play();
// 					this.setState(prevState => ({
// 						diceNumber: data,
// 						pieces: prevState.pieces.map(p => {
// 							if (p.animateForSelection === true && p.color === GREEN) {
// 								return {...p, animateForSelection: false};
// 							}
// 							return {...p};
// 						}),
// 					}));
// 				} else {
// 					this.setState(prevState => ({
// 						diceNumber: data,
// 						isWaitingForRollDice: false,
// 						isRolling: false,
// 						pieces: prevState.pieces.map(p => {
// 							if (p.animateForSelection === false && p.color === BLUE) {
// 								return {...p, animateForSelection: true};
// 							}
// 							return {...p};
// 						}),
// 					}));
// 				}
// 			});
// 		});

// 		// Pawn Move Socket Event Listener
// 		socket.on('pawnMove', data => {
// 			// console.log('Pawn Move Data on Blue Screen', data);
// 			if (data.type === 'SUCCESS') {
// 				this.setState({timerRunning: false});
// 				data.opp_position.forEach(async item => {
// 					let player = players.find(player => player.color === item.color);

// 					let piece = pieces.find(piece => piece.name === item.pawn && piece.color === player.color);

// 					if (piece.color === BLUE && data.user_id === user.id) {
// 						if (data.pawn_score < 51) {
// 							let prevPosition = parseInt(piece.position[2].substring(1, piece.position[2].length));
// 							let newPosition = parseInt(item.position.substring(1, item.position.length));
// 							// await this.movePawnByStep(prevPosition, newPosition, piece, 'P', null, data.sound);
// 							await this.movePiece(piece, prevPosition, newPosition, P, 'P').then(res => {
// 								console.log(res);
// 							});
// 						} else if (data.prev_score < 51 && data.pawn_score > 50) {
// 							let stepP = 50 - data.prev_score;
// 							let stepB = data.pawn_score - 50;
// 							// console.log(data);
// 							if (stepP > 0) {
// 								let prevPosition = parseInt(piece.position[2].substring(1, piece.position[2].length));
// 								let newPosition = prevPosition + 1;
// 								// await this.movePawnByStep(prevPosition, newPosition, piece, 'P', null, data.sound);
// 								await this.movePiece(piece, prevPosition, newPosition, P, 'P')
// 									.then(res => {
// 										// console.log(res);
// 										if (stepB > 0 && res === 'Completed') {
// 											// console.log(piece, 0, stepB, B, 'B');
// 											this.movePiece(piece, 1, stepB, B, 'B');
// 										}
// 									})
// 									.catch(err => {
// 										console.log(err);
// 									});
// 							}
// 							if (stepP <= 0 && stepB > 0) {
// 								if (item.position === FINISHED) {
// 									// await this.movePawnByStep(0, newPosition, piece, 'B', FINISHED);
// 									await this.movePiece(piece, 0, stepB, B, 'B');
// 								} else {
// 									// await this.movePawnByStep(0, newPosition, piece, 'B');
// 									await this.movePiece(piece, 0, stepB, B, 'B');
// 								}
// 							}
// 						}
// 					}
// 				});
// 				if (data.user_id === user.id) {
// 					this.setState(prev => ({
// 						players: prev.players.map(p => {
// 							if (p.color === BLUE) {
// 								return {...p, score: data.score};
// 							}
// 							if (P.color === GREEN) {
// 								return {...p, score: data.score1};
// 							}
// 							return p;
// 						}),
// 					}));
// 					//this.setState({score: data.score, score2: data.score1});
// 				} else {
// 					this.setState(prev => ({
// 						players: prev.players.map(p => {
// 							if (p.color === BLUE) {
// 								return {...p, score: data.score1};
// 							}
// 							if (P.color === GREEN) {
// 								return {...p, score: data.score};
// 							}
// 							return p;
// 						}),
// 					}));
// 					// this.setState({score: data.score1, score2: data.score});
// 				}
// 				if (data.turn === user.id) {
// 					this.setState(prev => ({turn: BLUE, key: prev.key + 1, timerRunning: true, isWaitingForRollDice: true}));
// 				} else {
// 					this.setState(prev => ({turn: GREEN, key: prev.key + 1, timerRunning: true}));
// 				}
// 				this.forceUpdate();
// 				this.setState({disable: false});
// 			}
// 			this.disableInput = false;
// 		});
// 	}

// 	rollDice() {
// 		if (!this.state.isWaitingForRollDice) {
// 			return;
// 		}
// 		DiceAudio.play();
// 		this.setState({isWaitingForRollDice: false, isRolling: true});
// 		socket.emit('diceRoll', {
// 			room_id: this.roomId,
// 			game_id: this.props.route.params.gameId,
// 			user_id: this.props.route.params.user.id,
// 		});
// 	}

// 	async onPieceTouch(piece) {
// 		// return console.log((cell === P ? 'P' : cell === B ? 'B' : cell === G ? 'G' : null) + cell.indexOf(piece.position));
// 		// console.log(piece);
// 		const {turn, isWaitingForRollDice, diceNumber} = this.state;
// 		const {user, gameId} = this.props.route.params;
// 		if (!diceNumber || piece.color !== BLUE || this.disableInput || isWaitingForRollDice || turn !== BLUE) {
// 			return;
// 		}

// 		this.disableInput = true;

// 		const data = {
// 			user_id: user.id,
// 			room_id: this.roomId,
// 			game_id: gameId,
// 			score: diceNumber,
// 			position: piece.position[2],
// 			pawn: piece.name === ONE ? 1 : piece.name === TWO ? 2 : piece.name === THREE ? 3 : piece.name === FOUR ? 4 : undefined,
// 		};

// 		socket.emit('pawnMove', data);
// 		// console.log(data);
// 		// this.setState({animateForSelection: false, timerRunning: false});
// 		this.setState(prevState => ({
// 			pieces: prevState.pieces.map(p => {
// 				// if (p.name === piece.name && p.color === piece.color) {
// 				// 	return {...p, animateForSelection: false};
// 				// }
// 				return {...p, animateForSelection: false};
// 			}),
// 			timerRunning: false,
// 		}));
// 	}

// 	async movePiece(piece, startPosition, endPosition, cell, indicator) {
// 		for (let i = startPosition; i <= endPosition; i++) {
// 			if (i > startPosition) {
// 				await new Promise(resolve => {
// 					setTimeout(() => {
// 						piece.position = cell[i];
// 						piece.animateForSelection = false;
// 						this.forceUpdate();
// 						// this.setState(prevState => ({
// 						// 	pieces: prevState.pieces.map(p => {
// 						// 		console.log({...p, position: cell[i], animateForSelection: false});
// 						// 		if (p.name === piece.name && p.color === piece.color) {
// 						// 			return {...p, position: cell[i], animateForSelection: false};
// 						// 		}
// 						// 		return {...p, animateForSelection: false};
// 						// 	}),
// 						// }));

// 						resolve();
// 					}, 150);
// 				});
// 			} else {
// 				piece.position = cell[i];
// 				piece.animateForSelection = false;
// 				this.forceUpdate();
// 				// this.setState(prevState => ({
// 				// 	pieces: prevState.pieces.map(p => {
// 				// 		console.log({...p, position: cell[i], animateForSelection: false});
// 				// 		if (p.name === piece.name && p.color === piece.color) {
// 				// 			return {...p, position: cell[i], animateForSelection: false};
// 				// 		}
// 				// 		return {...p, animateForSelection: false};
// 				// 	}),
// 				// }));
// 			}
// 			if (i >= endPosition) {
// 				return 'Completed';
// 			}
// 		}
// 	}

// 	updateScore(player, score) {
// 		this.setState(prev => ({
// 			players: prev.players.map(p => {
// 				if (p.color === player) {
// 					return {...p, score: score};
// 				}
// 				return p;
// 			}),
// 		}));
// 	}

// 	render() {
// 		const {diceNumber, isRolling, isWaitingForRollDice, pieces, players, timerRunning, turn} = this.state;
// 		const {bet, gameId} = this.props.route.params;
// 		return (
// 			<ImageBackground source={BG} style={styles.container}>
// 				<StatusBar translucent backgroundColor={'#ffffff00'} />
// 				<TopRow ping={500} bet={bet} gameId={gameId} openSettings={() => this.props.navigation.navigate('Settings')} />
// 				<View style={styles.board}>
// 					{/* Player Boxes */}
// 					{players.map((item, index) => (
// 						<PlayerBox player={{color: item.color, player: item.user}} score={item.score} currentUser={BLUE} diceNumber={diceNumber} turn={turn} key={index} />
// 					))}
// 					{/* Board Components */}
// 					<VerticalCellContainer positions={'top'} />
// 					<VerticalCellContainer positions={'bottom'} />
// 					<HorizontalCellContainer positions={'left'} />
// 					<HorizontalCellContainer positions={'right'} />
// 					<Center />
// 					{/* Pieces */}
// 					{pieces.map((item, index) => (
// 						<Piece
// 							position={item.position}
// 							size={item.size}
// 							color={item.color}
// 							onTouch={() => this.onPieceTouch(item, 1, 5, P)}
// 							name={item.name}
// 							key={index}
// 							animateForSelection={item.animateForSelection}
// 						/>
// 					))}
// 				</View>

// 				<Dice
// 					onDiceRoll={this.rollDice}
// 					// onComplete={() => {
// 					// 	if (turn === BLUE) {
// 					// 		setTimeout(this.handleUnsubscribe, 5000);
// 					// 	} else {
// 					// 		setTimeout(this.handleUnsubscribe, 10000);
// 					// 	}
// 					// }}
// 					onComplete={() => false}
// 					turn={turn}
// 					diceNumber={diceNumber}
// 					isRolling={isRolling}
// 					currentUser={BLUE}
// 					timerRunning={timerRunning}
// 					timerKey={this.state.key}
// 					isWaitingForRollDice={isWaitingForRollDice}
// 				/>
// 			</ImageBackground>
// 		);
// 	}
// }

import React, {useEffect, useRef, useState} from 'react';
import {ImageBackground, StatusBar, View} from 'react-native';

import styles from '../Game/Styles/styles';
import BG from '../Game/Assets/Backgrounds/GridBG.png';
import Dice from '../Game/Components/Dice';
import {P, B} from '../Game/Utils/positions';
import PlayerBox from '../Game/Components/PlayerBox';
import VerticalCellContainer from '../Game/Components/VerticalCellsContainer';
import HorizontalCellContainer from '../Game/Components/HorizontalCellsContainer';
import Center from '../Game/Components/Center';
import Piece from '../Game/Components/Piece';
import TopRow from '../Game/Components/TopRow';
import {BLUE, FINISHED, GREEN} from '../Game/Utils/constants';
import {DiceAudio} from '../Game/Components/Sounds';
import socket from '../Game/Components/Socket';
import {useDispatch, useSelector} from 'react-redux';
import {
	selectDiceNumber,
	selectIsRolling,
	selectIsWaitingForRollDice,
	selectPiece,
	selectPlayers,
	selectTurn,
	setDiceNumber,
	setIsRolling,
	setIsWaitingForRollDice,
	setPieces,
	setPlayers,
	setTurn,
} from '../Redux/Slices/GameSlice';

export default function Blue({route, navigation}) {
	const {player1, player2, player3, player4, user, bet, gameId} = route.params;
	const dispatch = useDispatch();
	const pieces = useSelector(selectPiece);
	const players = useSelector(selectPlayers);
	// const [pieces, setPieces] = useState([
	// 	{
	// 		position: P[1],
	// 		size: Constants.CELL_SIZE,
	// 		color: BLUE,
	// 		animateForSelection: true,
	// 		name: ONE,
	// 	},
	// 	{
	// 		position: P[1],
	// 		size: Constants.CELL_SIZE,
	// 		color: BLUE,
	// 		animateForSelection: false,
	// 		name: TWO,
	// 	},
	// 	{
	// 		position: P[1],
	// 		size: Constants.CELL_SIZE,
	// 		color: BLUE,
	// 		animateForSelection: false,
	// 		name: THREE,
	// 	},
	// 	{
	// 		position: P[1],
	// 		size: Constants.CELL_SIZE,
	// 		color: BLUE,
	// 		animateForSelection: false,
	// 		name: FOUR,
	// 	},
	// 	{
	// 		position: P[27],
	// 		size: Constants.CELL_SIZE,
	// 		color: GREEN,
	// 		animateForSelection: false,
	// 		name: ONE,
	// 	},
	// 	{
	// 		position: P[27],
	// 		size: Constants.CELL_SIZE,
	// 		color: GREEN,
	// 		animateForSelection: false,
	// 		name: TWO,
	// 	},
	// 	{
	// 		position: P[27],
	// 		size: Constants.CELL_SIZE,
	// 		color: GREEN,
	// 		animateForSelection: false,
	// 		name: THREE,
	// 	},
	// 	{
	// 		position: P[27],
	// 		size: Constants.CELL_SIZE,
	// 		color: GREEN,
	// 		animateForSelection: false,
	// 		name: FOUR,
	// 	},
	// ]);
	// const [players, setPlayers] = useState([
	// 	{
	// 		color: BLUE,
	// 		user: player1,
	// 		score: 0,
	// 	},
	// 	{
	// 		color: GREEN,
	// 		user: player2,
	// 		score: 1,
	// 	},
	// 	{
	// 		color: YELLOW,
	// 		user: player3,
	// 		score: 0,
	// 	},
	// 	{
	// 		color: RED,
	// 		user: player4,
	// 		score: 0,
	// 	},
	// ]);
	const turn = useSelector(selectTurn);
	const diceNumber = useSelector(selectDiceNumber);
	const isWaitingForRollDice = useSelector(selectIsWaitingForRollDice);
	const isRolling = useSelector(selectIsRolling);
	// const [turn, setTurn] = useState(BLUE);
	// const [diceNumber, setDiceNumber] = useState(0);
	// const [isWaitingForRollDice, setIsWaitingForRollDice] = useState(true);
	// const [isRolling, setIsRolling] = useState(false);
	const [timerRunning, setTimerRunning] = useState(true);
	const [key, setKey] = useState(1);

	const disableInput = useRef(false);
	const roomId = '' + user.id;

	useEffect(() => {
		const newPlayers = players.map(player => {
			if (player.color === BLUE) {
				return {...player, user: {...player1}};
			}
			if (player.color === GREEN) {
				return {...player, user: {...player2}};
			}
			return {...player};
		});
		console.log('Setting State of Players', newPlayers);
		dispatch(setPlayers(newPlayers));
		// Dice Roll Socket Event Listener
		socket.on('diceRoll', data => {
			console.log(data, 'Dice Roll Data');
			setTimeout(() => {
				console.log('heeeioueruiewureur\n');
				if (turn === GREEN) {
					DiceAudio.play();
					const newPieces = pieces.map(piece => {
						if (piece.color === GREEN) {
							return {...piece, animateForSelection: false};
						}
						return {...piece};
					});
					console.log('Setting State of Pieces inside DiceRoll', newPieces, '\n Dice Number is', data);
					dispatch(setPieces(newPieces));
					dispatch(setDiceNumber(data));
					// setPieces(newPieces);
					// setDiceNumber(data);
					console.log('aaaaaaaà111111111111\n');
					// setPieces(prev => {
					// 	prev.map(p => {
					// 		if (p.animateForSelection === true && p.color === GREEN) {
					// 			return {...p, animateForSelection: false};
					// 		}
					// 		return {...p};
					// 	});
					// });
				} else {
					const newPieces = pieces.map(piece => {
						if (piece.color === BLUE) {
							return {...piece, animateForSelection: true};
						}
						return {...piece};
					});
					console.log('Setting State of Pieces inside else DiceRoll', newPieces, '\n DiceNumber', data);
					dispatch(setPieces(newPieces));
					dispatch(setIsWaitingForRollDice(false));
					dispatch(setIsRolling(false));
					dispatch(setDiceNumber(data));
					console.log(data);
					console.log('Dice Roll State', diceNumber);
					console.log('bbbbbbb22222222222222\n');
				}
			});

			return console.log(pieces);
		});

		// Pawn Move Socket Event Listener
		socket.on('pawnMove', data => {
			// console.log('Pawn Move Data on Blue Screen', data);
			if (data.type === 'SUCCESS') {
				setTimerRunning(false);
				data.opp_position.forEach(async item => {
					let player = players.find(player => player.color === item.color);

					let piece = pieces.find(piece => piece.name === item.pawn && piece.color === player.color);

					if (piece.color === BLUE && data.user_id === user.id) {
						if (data.pawn_score < 51) {
							let prevPosition = parseInt(piece.position[2].substring(1, piece.position[2].length));
							let newPosition = parseInt(item.position.substring(1, item.position.length));
							// await this.movePawnByStep(prevPosition, newPosition, piece, 'P', null, data.sound);
							await movePiece(piece, prevPosition, newPosition, P, 'P').then(res => {
								console.log(res);
							});
						} else if (data.prev_score < 51 && data.pawn_score > 50) {
							let stepP = 50 - data.prev_score;
							let stepB = data.pawn_score - 50;
							// console.log(data);
							if (stepP > 0) {
								let prevPosition = parseInt(piece.position[2].substring(1, piece.position[2].length));
								let newPosition = prevPosition + 1;
								// await this.movePawnByStep(prevPosition, newPosition, piece, 'P', null, data.sound);
								await movePiece(piece, prevPosition, newPosition, P, 'P')
									.then(res => {
										// console.log(res);
										if (stepB > 0 && res === 'Completed') {
											// console.log(piece, 0, stepB, B, 'B');
											movePiece(piece, 1, stepB, B, 'B');
										}
									})
									.catch(err => {
										console.log(err);
									});
							}
							if (stepP <= 0 && stepB > 0) {
								if (item.position === FINISHED) {
									// await this.movePawnByStep(0, newPosition, piece, 'B', FINISHED);
									await movePiece(piece, 0, stepB, B, 'B');
								} else {
									// await this.movePawnByStep(0, newPosition, piece, 'B');
									await movePiece(piece, 0, stepB, B, 'B');
								}
							}
						}
					}
				});
				if (data.user_id === user.id) {
					const newPlayers = players.map(player => {
						if (player.color === BLUE) {
							return {...player, score: data.score};
						}
						if (player.color === GREEN) {
							return {...player, score: data.score1};
						}
						return player;
					});
					dispatch(setPlayers(newPlayers));
				} else {
					const newPlayers = players.map(player => {
						if (player.color === BLUE) {
							return {...player, score: data.score1};
						}
						if (player.color === GREEN) {
							return {...player, score: data.score};
						}
						return player;
					});
					dispatch(setPlayers(newPlayers));
				}
				if (data.turn === user.id) {
					dispatch(setTurn(BLUE));
					setKey(prev => prev + 1);
					dispatch(setTimerRunning(true));
					dispatch(setIsWaitingForRollDice(true));
				} else {
					dispatch(setTurn(GREEN));
					setKey(prev => prev + 1);
					setTimerRunning(true);
				}
			}
			disableInput.current = false;
		});
	}, []);

	const rollDice = () => {
		if (!isWaitingForRollDice) {
			console.log(pieces);
			return;
		}
		DiceAudio.play();
		dispatch(setIsWaitingForRollDice(false));
		dispatch(setIsRolling(true));
		socket.emit('diceRoll', {
			room_id: roomId,
			game_id: gameId,
			user_id: user.id,
		});
	};

	const onPieceTouch = async piece => {
		// return console.log((cell === P ? 'P' : cell === B ? 'B' : cell === G ? 'G' : null) + cell.indexOf(piece.position));
		if (!diceNumber || piece.color !== BLUE || disableInput.current || isWaitingForRollDice || turn !== BLUE) {
			console.log(diceNumber, piece.color, disableInput.current, isWaitingForRollDice, turn);
			return;
		}

		disableInput.current = true;

		const data = {
			user_id: user.id,
			room_id: roomId,
			game_id: gameId,
			score: diceNumber,
			position: piece.position[2],
			pawn: piece.name,
		};

		socket.emit('pawnMove', data);
		const newPieces = pieces.map(p => {
			return {...p, animateForSelection: false};
		});
		dispatch(setPieces(newPieces));
		setTimerRunning(false);
	};

	const movePiece = async (piece, startPosition, endPosition, cell, indicator) => {
		for (let i = startPosition; i <= endPosition; i++) {
			if (i > startPosition) {
				await new Promise(resolve => {
					setTimeout(() => {
						const newPieces = pieces.map(p => {
							if (p.name === piece.name && p.color === piece.color) {
								return {...p, position: cell[i], animateForSelection: false};
							}
							return {...p, animateForSelection: false};
						});
						dispatch(setPieces(newPieces));

						resolve();
					}, 150);
				});
			} else {
				const newPieces = pieces.map(p => {
					if (p.name === piece.name && p.color === piece.color) {
						return {...p, position: cell[i], animateForSelection: false};
					}
					return {...p, animateForSelection: false};
				});
				dispatch(setPieces(newPieces));
			}
			if (i >= endPosition) {
				return 'Completed';
			}
		}
	};

	const updateScore = (player, score) => {
		setPlayers(prev => {
			prev.map(p => {
				if (p.color === player) {
					return {...p, score: score};
				}
				return p;
			});
		});
	};
	return (
		<ImageBackground source={BG} style={styles.container}>
			<StatusBar translucent backgroundColor={'#ffffff00'} />
			<TopRow ping={500} bet={bet} gameId={gameId} openSettings={() => navigation.navigate('Settings')} />
			<View style={styles.board}>
				{/* Player Boxes */}
				{players.map((item, index) => (
					<PlayerBox player={{color: item.color, player: item.user}} score={item.score} currentUser={BLUE} diceNumber={diceNumber} turn={turn} key={index} />
				))}
				{/* Board Components */}
				<VerticalCellContainer positions={'top'} />
				<VerticalCellContainer positions={'bottom'} />
				<HorizontalCellContainer positions={'left'} />
				<HorizontalCellContainer positions={'right'} />
				<Center />
				{/* Pieces */}
				{pieces &&
					pieces.map((item, index) => (
						<Piece
							position={item.position}
							size={item.size}
							color={item.color}
							onTouch={() => onPieceTouch(item, 1, 5, P)}
							name={item.name}
							key={index}
							animateForSelection={item.animateForSelection}
						/>
					))}
			</View>

			<Dice
				onDiceRoll={rollDice}
				// onComplete={() => {
				// 	if (turn === BLUE) {
				// 		setTimeout(this.handleUnsubscribe, 5000);
				// 	} else {
				// 		setTimeout(this.handleUnsubscribe, 10000);
				// 	}
				// }}
				onComplete={() => false}
				turn={turn}
				diceNumber={diceNumber}
				isRolling={isRolling}
				currentUser={BLUE}
				timerRunning={timerRunning}
				timerKey={key}
				isWaitingForRollDice={isWaitingForRollDice}
			/>
		</ImageBackground>
	);
}
