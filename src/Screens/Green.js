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
// import {Constants, P, B, G} from '../Game/Utils/positions2';
// import PlayerBox from '../Game/Components/PlayerBox';
// import VerticalCellContainer from '../Game/Components/VerticalCellsContainer';
// import HorizontalCellContainer from '../Game/Components/HorizontalCellsContainer';
// import Center from '../Game/Components/Center';
// import Piece from '../Game/Components/Piece';
// import TopRow from '../Game/Components/TopRow';
// import {BLUE, FINISHED, FOUR, GREEN, ONE, RED, THREE, TWO, YELLOW} from '../Game/Utils/constants';
// import {DiceAudio} from '../Game/Components/Sounds';
// import socket from '../Game/Components/Socket';

// export default class Green extends Component {
// 	constructor(props) {
// 		super(props);
// 		const {player1, player2, player3, player4} = this.props.route.params;
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
// 					score: 0,
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
// 			diceNumber: 0,
// 			isWaitingForRollDice: true,
// 			isRolling: false,
// 			timerRunning: false,
// 			key: 1,
// 			ping: 0,
// 		};

// 		this.disableInput = false;
// 		this.roomId = '' + player1?.id;
// 		this.pingTime = 0;

// 		this.rollDice = this.rollDice.bind(this);
// 		this.movePiece = this.movePiece.bind(this);
// 	}

// 	componentDidMount() {
// 		const {pieces, turn, players, key} = this.state;
// 		const {user, gameId} = this.props.route.params;
// 		// console.log(user, gameId);

// 		socket.emit('pong', 'Pong');

// 		socket.on('ping', () => {
// 			this.setState({ping: this.state.ping === 0 ? 'Connecting...' : Date.now() - this.pingTime});
// 			// this.ping = Date.now() - this.pingTime;
// 			setTimeout(() => {
// 				socket.emit('pong', 'Pong');
// 				this.pingTime = Date.now();
// 			}, 1000);
// 		});
// 		socket.emit('createRoom', this.roomId);
// 		//socket.on('roomsList', data => console.log('Rooms List of Green', data));
// 		socket.emit('joining', {
// 			room_id: this.roomId,
// 			game_id: gameId,
// 		});
// 		// Dice Roll Socket Event Listener
// 		socket.on('diceRoll', data => {
// 			console.log(data, 'Dice Roll Data Greennnasdfsdaaszdsad', turn);
// 			setTimeout(() => {
// 				if (turn === BLUE) {
// 					DiceAudio.play();
// 					this.setState(prevState => ({
// 						diceNumber: data,
// 						pieces: prevState.pieces.map(p => {
// 							if (p.animateForSelection === true && p.color === BLUE) {
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
// 							if (p.animateForSelection === false && p.color === GREEN) {
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
// 			//console.log('Pawn Move Data in Green Screen', data);
// 			if (data.type === 'SUCCESS') {
// 				this.setState({timerRunning: false});
// 				console.log('For Each in pawnmove');
// 				data.opp_position.forEach(async item => {
// 					let player = players.find(player => player.color === item.color);

// 					let piece = pieces.find(piece => piece.name === item.pawn && piece.color === player.color);

// 					if (piece.color === GREEN && data.user_id === user.id) {
// 						if (data.pawn_score < 51) {
// 							console.log(1111111111);
// 							let prevPosition = parseInt(piece.position[2].substring(1, piece.position[2].length));
// 							let newPosition = parseInt(item.position.substring(1, item.position.length));
// 							// await this.movePawnByStep(prevPosition, newPosition, piece, 'P', null, data.sound);
// 							await this.movePiece(piece, prevPosition, newPosition, P, 'P').then(res => {
// 								console.log(res, 'Move Pawn');
// 							});
// 						} else if (data.prev_score < 51 && data.pawn_score > 50) {
// 							console.log(2222222222222);
// 							let stepP = 50 - data.prev_score;
// 							let stepB = data.pawn_score - 50;
// 							if (stepP > 0) {
// 								let prevPosition = parseInt(piece.position[2].substring(1, piece.position[2].length));
// 								let newPosition = prevPosition + 1;
// 								// await this.movePawnByStep(prevPosition, newPosition, piece, 'P', null, data.sound);
// 								await this.movePiece(piece, prevPosition, newPosition, P, 'P')
// 									.then(res => {
// 										// console.log(res);
// 										if (stepB > 0 && res === 'Completed') {
// 											// console.log(piece, 0, stepB, G, 'G');
// 											this.movePiece(piece, 1, stepB, G, 'G');
// 										}
// 									})
// 									.catch(err => {
// 										console.log(err);
// 									});
// 							}
// 							if (stepP <= 0 && stepB > 0) {
// 								if (item.position === FINISHED) {
// 									// await this.movePawnByStep(0, newPosition, piece, 'B', FINISHED);
// 									await this.movePiece(piece, 0, stepB, G, 'G');
// 								} else {
// 									// await this.movePawnByStep(0, newPosition, piece, 'B');
// 									await this.movePiece(piece, 0, stepB, G, 'G');
// 								}
// 							}
// 						}
// 					} else if (piece.position !== item.position && item.color !== GREEN) {
// 						console.log(33333333333);
// 						let prevPos = piece.position;
// 						if (data.pawn_score < 51) {
// 							console.log(prevPos);
// 							let prevPosition = parseInt(prevPos[2].substring(1, prevPos.length));
// 							let newPosition = parseInt(item.position.substring(1, item.position.length));
// 							await this.movePiece(piece, prevPosition, newPosition, P, 'P');
// 						} else if (data.prev_score < 51 && data.pawn_score > 50) {
// 							console.log(444444444444);
// 							let stepP = 50 - data.prev_score;
// 							let stepB = data.pawn_score - 50;
// 							if (stepP > 0) {
// 								let prevPosition = parseInt(prevPos[2].substring(1, prevPos.length));
// 								let newPosition = prevPosition + 1;
// 								await this.movePiece(piece, prevPosition, newPosition, P, 'P').then(res => {
// 									if (res === 'Completed' && stepB > 0) {
// 										this.movePiece(piece, 1, stepB, B, 'B');
// 									}
// 								});
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
// 								return {...p, score: data.score1};
// 							}
// 							if (p.color === GREEN) {
// 								return {...p, score: data.score};
// 							}
// 							return p;
// 						}),
// 					}));
// 					// this.setState({score: data.score, score2: data.score1});
// 				} else {
// 					this.setState(prev => ({
// 						players: prev.players.map(p => {
// 							if (p.color === BLUE) {
// 								return {...p, score: data.score};
// 							}
// 							if (p.color === GREEN) {
// 								return {...p, score: data.score1};
// 							}
// 							return p;
// 						}),
// 					}));
// 					// this.setState({score: data.score1, score2: data.score});
// 				}
// 				if (data.turn === user.id) {
// 					this.setState({turn: GREEN, key: key + 1, timerRunning: true, isWaitingForRollDice: true});
// 					turn = GREEN;
// 				} else {
// 					this.setState({turn: BLUE, key: key + 1, timerRunning: true});
// 					turn = BLUE;
// 				}
// 				this.forceUpdate();
// 			}
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
// 		// console.log(piece, 'piece touch');
// 		const {turn, isWaitingForRollDice, diceNumber} = this.state;
// 		const {user, gameId} = this.props.route.params;
// 		if (!diceNumber || piece.color !== GREEN || this.disableInput || isWaitingForRollDice || turn !== GREEN) {
// 			console.log('Here');
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
// 						this.setState(prevState => ({
// 							pieces: prevState.pieces.map(p => {
// 								if (p.name === piece.name && p.color === piece.color) {
// 									return {...p, position: [...cell[i], indicator + i], animateForSelection: false};
// 								}
// 								return {...p, animateForSelection: false};
// 							}),
// 						}));

// 						resolve();
// 					}, 150);
// 				});
// 			} else {
// 				this.setState(prevState => ({
// 					pieces: prevState.pieces.map(p => {
// 						if (p.name === piece.name && p.color === piece.color) {
// 							return {...p, position: [...cell[i], indicator + i], animateForSelection: false};
// 						}
// 						return {...p, animateForSelection: false};
// 					}),
// 				}));
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
// 		const {diceNumber, isRolling, isWaitingForRollDice, pieces, players, timerRunning, turn, ping} = this.state;
// 		const {bet, gameId} = this.props.route.params;
// 		console.log(turn);
// 		return (
// 			<ImageBackground source={BG} style={styles.container}>
// 				<StatusBar translucent backgroundColor={'#ffffff00'} />
// 				<TopRow ping={ping} bet={bet} gameId={gameId} openSettings={() => this.props.navigation.navigate('Settings')} />
// 				<View style={styles.board}>
// 					{/* Player Boxes */}
// 					{players.map((item, index) => (
// 						<PlayerBox player={{color: item.color, player: item.user}} score={item.score} currentUser={GREEN} diceNumber={diceNumber} turn={turn} game2 key={index} />
// 					))}
// 					{/* Board Components */}
// 					<VerticalCellContainer positions={'top'} game2 />
// 					<VerticalCellContainer positions={'bottom'} game2 />
// 					<HorizontalCellContainer positions={'left'} game2 />
// 					<HorizontalCellContainer positions={'right'} game2 />
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
// 					// 	if (turn === GREEN) {
// 					// 		setTimeout(this.handleUnsubscribe, 5000);
// 					// 	} else {
// 					// 		setTimeout(this.handleUnsubscribe, 10000);
// 					// 	}
// 					// }}
// 					onComplete={() => false}
// 					turn={turn}
// 					diceNumber={diceNumber}
// 					isRolling={isRolling}
// 					currentUser={GREEN}
// 					timerRunning={timerRunning}
// 					timerKey={this.state.key}
// 					isWaitingForRollDice={isWaitingForRollDice}
// 				/>
// 			</ImageBackground>
// 		);
// 	}
// }

import React, {Component} from 'react';
import {Alert, BackHandler, ImageBackground, StatusBar, Text, ToastAndroid, TouchableOpacity, View, Vibration} from 'react-native';
import {Button, IconButton} from 'react-native-paper';
import io from 'socket.io-client';
import NetInfo from '@react-native-community/netinfo';
import {Icon} from 'react-native-elements';

import styles from '../Game/Styles/styles';
import {c} from '../Game/Utils/colors';
import BG from '../Game/Assets/Backgrounds/GridBG.png';
import Popup from '../Components/Popup';
import Dice from '../Game/Components/Dice';
import {SW} from '../Config/Config';
import {Constants, P, B, G} from '../Game/Utils/positions2';
import PlayerBox from '../Game/Components/PlayerBox';
import VerticalCellContainer from '../Game/Components/VerticalCellsContainer';
import HorizontalCellContainer from '../Game/Components/HorizontalCellsContainer';
import Center from '../Game/Components/Center';
import Piece from '../Game/Components/Piece';
import TopRow from '../Game/Components/TopRow';
import {BLUE, FINISHED, FOUR, GREEN, ONE, RED, THREE, TWO, YELLOW} from '../Game/Utils/constants';
import {DiceAudio} from '../Game/Components/Sounds';
import socket from '../Game/Components/Socket';

export default class Green extends Component {
	constructor(props) {
		super(props);
		const {player1, player2, player3, player4, user} = this.props.route.params;
		this.state = {
			pieces: [
				{
					position: P[1],
					size: Constants.CELL_SIZE,
					color: BLUE,
					animateForSelection: true,
					name: ONE,
				},
				{
					position: P[1],
					size: Constants.CELL_SIZE,
					color: BLUE,
					animateForSelection: false,
					name: TWO,
				},
				{
					position: P[1],
					size: Constants.CELL_SIZE,
					color: BLUE,
					animateForSelection: false,
					name: THREE,
				},
				{
					position: P[1],
					size: Constants.CELL_SIZE,
					color: BLUE,
					animateForSelection: false,
					name: FOUR,
				},
				{
					position: P[27],
					size: Constants.CELL_SIZE,
					color: GREEN,
					animateForSelection: false,
					name: ONE,
				},
				{
					position: P[27],
					size: Constants.CELL_SIZE,
					color: GREEN,
					animateForSelection: false,
					name: TWO,
				},
				{
					position: P[27],
					size: Constants.CELL_SIZE,
					color: GREEN,
					animateForSelection: false,
					name: THREE,
				},
				{
					position: P[27],
					size: Constants.CELL_SIZE,
					color: GREEN,
					animateForSelection: false,
					name: FOUR,
				},
			],
			players: [
				{
					color: BLUE,
					user: player1,
					score: 0,
				},
				{
					color: GREEN,
					user: player2,
					score: 1,
				},
				{
					color: YELLOW,
					user: player3,
					score: 0,
				},
				{
					color: RED,
					user: player4,
					score: 0,
				},
			],
			turn: BLUE,
			diceNumber: 5,
			isWaitingForRollDice: true,
			isRolling: false,
			timerRunning: false,
			key: 1,
		};

		this.disableInput = false;
		this.roomId = '' + player1.id;

		this.rollDice = this.rollDice.bind(this);
		this.onPieceTouch = this.onPieceTouch.bind(this);
	}

	componentDidMount() {
		const {pieces, turn, players, key} = this.state;
		const {user, gameId} = this.props.route.params;
		// Dice Roll Socket Event Listener
		socket.emit('createRoom', this.roomId);
		//socket.on('roomsList', data => console.log('Rooms List of Green', data));
		socket.emit('pong', 'Pong');

		socket.on('ping', () => {
			this.setState({ping: this.state.ping === 0 ? 'Connecting...' : Date.now() - this.pingTime});
			// this.ping = Date.now() - this.pingTime;
			setTimeout(() => {
				socket.emit('pong', 'Pong');
				this.pingTime = Date.now();
			}, 1000);
		});
		socket.emit('joining', {
			room_id: this.roomId,
			game_id: gameId,
		});
		socket.on('diceRoll', data => {
			// console.log(data, 'Dice Roll Data');
			setTimeout(() => {
				if (turn === BLUE) {
					DiceAudio.play();
					this.setState(prevState => ({
						diceNumber: data,
						pieces: prevState.pieces.map(p => {
							if (p.animateForSelection === true && p.color === BLUE) {
								return {...p, animateForSelection: false};
							}
							return {...p};
						}),
					}));
				} else {
					this.setState(prevState => ({
						diceNumber: data,
						isWaitingForRollDice: false,
						isRolling: false,
						pieces: prevState.pieces.map(p => {
							if (p.animateForSelection === false && p.color === GREEN) {
								return {...p, animateForSelection: true};
							}
							return {...p};
						}),
					}));
				}
			});
		});

		// Pawn Move Socket Event Listener
		socket.on('pawnMove', data => {
			// console.log('Pawn Move Data on Blue Screen', data);
			if (data.type === 'SUCCESS') {
				this.setState({timerRunning: false});
				data.opp_position.forEach(async item => {
					let player = players.find(player => player.color === item.color);

					let piece = pieces.find(piece => piece.name === item.pawn && piece.color === player.color);

					if (piece.color === GREEN && data.user_id === user.id) {
						if (data.pawn_score < 51) {
							let prevPosition = parseInt(piece.position[2].substring(1, piece.position[2].length));
							let newPosition = parseInt(item.position.substring(1, item.position.length));
							// await this.movePawnByStep(prevPosition, newPosition, piece, 'P', null, data.sound);
							await this.movePiece(piece, prevPosition, newPosition, P, 'P').then(res => {
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
								await this.movePiece(piece, prevPosition, newPosition, P, 'P')
									.then(res => {
										// console.log(res);
										if (stepB > 0 && res === 'Completed') {
											// console.log(piece, 0, stepB, B, 'B');
											this.movePiece(piece, 1, stepB, B, 'B');
										}
									})
									.catch(err => {
										console.log(err);
									});
							}
							if (stepP <= 0 && stepB > 0) {
								if (item.position === FINISHED) {
									// await this.movePawnByStep(0, newPosition, piece, 'B', FINISHED);
									await this.movePiece(piece, 0, stepB, B, 'B');
								} else {
									// await this.movePawnByStep(0, newPosition, piece, 'B');
									await this.movePiece(piece, 0, stepB, B, 'B');
								}
							}
						}
					}
				});
				if (data.user_id === user.id) {
					this.setState(prev => ({
						players: prev.players.map(p => {
							if (p.color === GREEN) {
								return {...p, score: data.score};
							}
							if (P.color === BLUE) {
								return {...p, score: data.score1};
							}
							return p;
						}),
					}));
					//this.setState({score: data.score, score2: data.score1});
				} else {
					this.setState(prev => ({
						players: prev.players.map(p => {
							if (p.color === GREEN) {
								return {...p, score: data.score1};
							}
							if (P.color === BLUE) {
								return {...p, score: data.score};
							}
							return p;
						}),
					}));
					// this.setState({score: data.score1, score2: data.score});
				}
				if (data.turn === user.id) {
					this.setState(prev => ({turn: GREEN, key: prev.key + 1, timerRunning: true, isWaitingForRollDice: true}));
				} else {
					this.setState(prev => ({turn: BLUE, key: prev.key + 1, timerRunning: true}));
				}
				// this.forceUpdate();
				this.setState({disable: false});
			}
			this.disableInput = false;
		});
	}

	rollDice() {
		if (!this.state.isWaitingForRollDice) {
			return;
		}
		DiceAudio.play();
		this.setState({isWaitingForRollDice: false, isRolling: true});
		socket.emit('diceRoll', {
			room_id: this.roomId,
			game_id: this.props.route.params.gameId,
			user_id: this.props.route.params.user.id,
		});
	}

	async onPieceTouch(piece) {
		// return console.log((cell === P ? 'P' : cell === B ? 'B' : cell === G ? 'G' : null) + cell.indexOf(piece.position));
		// console.log(piece);
		const {turn, isWaitingForRollDice, diceNumber} = this.state;
		const {user, gameId} = this.props.route.params;
		if (!diceNumber || piece.color !== GREEN || this.disableInput || isWaitingForRollDice || turn !== GREEN) {
			return;
		}

		this.disableInput = true;

		const data = {
			user_id: user.id,
			room_id: this.roomId,
			game_id: gameId,
			score: diceNumber,
			position: piece.position[2],
			pawn: piece.name === ONE ? 1 : piece.name === TWO ? 2 : piece.name === THREE ? 3 : piece.name === FOUR ? 4 : undefined,
		};

		socket.emit('pawnMove', data);
		// console.log(data);
		// this.setState({animateForSelection: false, timerRunning: false});
		this.setState(prevState => ({
			pieces: prevState.pieces.map(p => {
				// if (p.name === piece.name && p.color === piece.color) {
				// 	return {...p, animateForSelection: false};
				// }
				return {...p, animateForSelection: false};
			}),
			timerRunning: false,
		}));
	}

	async movePiece(piece, startPosition, endPosition, cell, indicator) {
		for (let i = startPosition; i <= endPosition; i++) {
			console.log(piece.position);
			if (i > startPosition) {
				await new Promise(resolve => {
					setTimeout(() => {
						this.setState(prevState => ({
							pieces: prevState.pieces.map(p => {
								if (p.name === piece.name && p.color === piece.color) {
									return {...p, position: cell[i], animateForSelection: false};
								}
								return {...p, animateForSelection: false};
							}),
						}));

						resolve();
					}, 150);
				});
			} else {
				this.setState(prevState => ({
					pieces: prevState.pieces.map(p => {
						if (p.name === piece.name && p.color === piece.color) {
							return {...p, position: cell[i], animateForSelection: false};
						}
						return {...p, animateForSelection: false};
					}),
				}));
			}
			if (i >= endPosition) {
				return 'Completed';
			}
		}
	}

	updateScore(player, score) {
		this.setState(prev => ({
			players: prev.players.map(p => {
				if (p.color === player) {
					return {...p, score: score};
				}
				return p;
			}),
		}));
	}

	render() {
		const {diceNumber, isRolling, isWaitingForRollDice, pieces, players, timerRunning, turn} = this.state;
		const {bet, gameId} = this.props.route.params;
		return (
			<ImageBackground source={BG} style={styles.container}>
				<StatusBar translucent backgroundColor={'#ffffff00'} />
				<TopRow ping={500} bet={bet} gameId={gameId} openSettings={() => this.props.navigation.navigate('Settings')} />
				<View style={styles.board}>
					{/* Player Boxes */}
					{players.map((item, index) => (
						<PlayerBox player={{color: item.color, player: item.user}} score={item.score} currentUser={GREEN} diceNumber={diceNumber} turn={turn} key={index} game2 />
					))}
					{/* Board Components */}
					<VerticalCellContainer positions={'top'} game2 />
					<VerticalCellContainer positions={'bottom'} game2 />
					<HorizontalCellContainer positions={'left'} game2 />
					<HorizontalCellContainer positions={'right'} game2 />
					<Center />
					{/* Pieces */}
					{pieces.map((item, index) => (
						<Piece
							position={item.position}
							size={item.size}
							color={item.color}
							onTouch={() => this.onPieceTouch(item, 1, 5, P)}
							name={item.name}
							key={index}
							game2
							animateForSelection={item.animateForSelection}
						/>
					))}
				</View>

				<Dice
					onDiceRoll={this.rollDice}
					// onComplete={() => {
					// 	if (turn === BLUE) {
					// 		setTimeout(this.handleUnsubscribe, 5000);
					// 	} else {
					// 		setTimeout(this.handleUnsubscribe, 10000);
					// 	}
					// }}
					onComplete={() => false}
					turn={turn}
					game2
					diceNumber={diceNumber}
					isRolling={isRolling}
					currentUser={GREEN}
					timerRunning={timerRunning}
					timerKey={this.state.key}
					isWaitingForRollDice={isWaitingForRollDice}
				/>
			</ImageBackground>
		);
	}
}
