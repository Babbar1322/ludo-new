import {createSlice} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
	user: null,
	isLoggedIn: false,
	balance: 0,
};

const AuthSlice = createSlice({
	name: 'Auth',
	initialState,
	reducers: {
		setLogin: (state, action) => {
			state.isLoggedIn = action.payload.isLoggedIn;
			state.user = action.payload.user;
			AsyncStorage.setItem('isLoggedIn', JSON.stringify(action.payload.isLoggedIn));
			AsyncStorage.setItem('user', JSON.stringify(action.payload.user));
		},
		setLogout: state => {
			state.isLoggedIn = false;
			AsyncStorage.clear();
			state.user = null;
		},
		startUp: (state, action) => {
			state.isLoggedIn = action.payload.isLoggedIn;
			state.user = action.payload.user;
			// state.AppVersion = action.payload.AppVersion;
		},
		setBalance: (state, action) => {
			state.balance = action.payload;
			// AsyncStorage.setItem("AppVersion", JSON.stringify(action.payload.AppVersion));
		},
		setUser: (state, action) => {
			state.user = action.payload.user;
			AsyncStorage.setItem('user', JSON.stringify(action.payload.user));
		},
	},
});

export const {setLogin, setLogout, startUp, setUser, setBalance} = AuthSlice.actions;

export const selectIsLoggedIn = state => state.Auth.isLoggedIn;
export const selectUser = state => state.Auth.user;
export const selectBalance = state => state.Auth.balance;
// export const selectAppVersion = (state) => state.Auth.selectAppVersion;

export default AuthSlice.reducer;
