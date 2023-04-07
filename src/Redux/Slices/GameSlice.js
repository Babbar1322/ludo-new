import AsyncStorage from '@react-native-async-storage/async-storage';
import {createSlice} from '@reduxjs/toolkit';
import {BLUE, FOUR, GREEN, ONE, RED, THREE, TWO, YELLOW} from '../../Game/Utils/constants';
import {Constants, P} from '../../Game/Utils/positions';

const initialState = {
	turn: BLUE,
	pieces: [
		{
			position: P[1],
			size: Constants.CELL_SIZE,
			color: BLUE,
			animateForSelection: false,
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
			user: {},
			score: 0,
		},
		{
			color: GREEN,
			user: {},
			score: 1,
		},
		{
			color: YELLOW,
			user: {},
			score: 0,
		},
		{
			color: RED,
			user: {},
			score: 0,
		},
	],
	isRolling: false,
	diceNumber: 1,
	isMusicPlaying: null,
	isWaitingForRollDice: true,
};

const GameSlice = createSlice({
	name: 'Game',
	initialState,
	reducers: {
		setTurn: (state, action) => {
			state.turn = action.payload;
		},
		setIsRolling: (state, action) => {
			state.isRolling = action.payload;
		},
		setDiceNumber: (state, action) => {
			state.diceNumber = action.payload;
		},
		setMusic: (state, action) => {
			state.isMusicPlaying = action.payload;
			AsyncStorage.setItem('music', JSON.stringify(action.payload));
		},
		setPieces: (state, action) => {
			state.pieces = action.payload;
		},
		setPlayers: (state, action) => {
			state.players = action.payload;
		},
		setIsWaitingForRollDice: (state, action) => {
			state.isWaitingForRollDice = action.payload;
		},
	},
});

export const {setIsRolling, setTurn, setDiceNumber, setMusic, setPieces, setPlayers, setIsWaitingForRollDice} = GameSlice.actions;

export const selectIsRolling = state => state.Game.isRolling;
export const selectTurn = state => state.Game.turn;
export const selectDiceNumber = state => state.Game.diceNumber;
export const selectIsMusicPlaying = state => state.Game.isMusicPlaying;
export const selectPlayers = state => state.Game.players;
export const selectPiece = state => state.Game.pieces;
export const selectIsWaitingForRollDice = state => state.Game.isWaitingForRollDice;

export default GameSlice.reducer;
