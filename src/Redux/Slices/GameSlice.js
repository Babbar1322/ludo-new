import AsyncStorage from '@react-native-async-storage/async-storage';
import {createSlice} from '@reduxjs/toolkit';

const initialState = {
	gameId: null,
	turn: 'blue',
	moves: 0,
	score: 0,
	score2: 0,
	isRolling: false,
	diceNumber: 1,
	isMusicPlaying: null,
};

const GameSlice = createSlice({
	name: 'Game',
	initialState,
	reducers: {
		setMoves: (state, action) => {
			state.moves = action.payload;
		},
		setTurn: (state, action) => {
			state.turn = action.payload;
		},
		setIsRolling: (state, action) => {
			state.isRolling = action.payload;
		},
		setGameId: (state, action) => {
			state.gameId = action.payload;
		},
		setScore: (state, action) => {
			state.score = action.payload.score;
			state.score2 = action.payload.score2;
		},
		setDiceNumber: (state, action) => {
			state.diceNumber = action.payload;
		},
		setMusic: (state, action) => {
			state.isMusicPlaying = action.payload;
			AsyncStorage.setItem('music', JSON.stringify(action.payload));
		},
	},
});

export const {setGameId, setIsRolling, setMoves, setScore, setTurn, setDiceNumber, setMusic} = GameSlice.actions;

export const selectIsRolling = state => state.Game.isRolling;
export const selectTurn = state => state.Game.turn;
export const selectGameId = state => state.Game.gameId;
export const selectMoves = state => state.Game.moves;
export const selectDiceNumber = state => state.Game.diceNumber;
export const selectScore = state => state.Game.score;
export const selectScore2 = state => state.Game.score2;
export const selectIsMusicPlaying = state => state.Game.isMusicPlaying;

export default GameSlice.reducer;
