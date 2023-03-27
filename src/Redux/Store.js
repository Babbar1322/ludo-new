import {configureStore, combineReducers} from '@reduxjs/toolkit';
import AuthSlice from './Slices/AuthSlice';
import GameSlice from './Slices/GameSlice';

const reducers = combineReducers({
	Auth: AuthSlice,
	Game: GameSlice,
});

export const Store = configureStore({
	reducer: reducers,
});
