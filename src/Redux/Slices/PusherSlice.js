import { createSlice } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialState = {
    pusher: null
}

const PusherSlice = createSlice({
    name: 'Pusher',
    initialState,
    reducers: {
        setPusher: (state, action) => {
            state.pusher = action.payload;
            // AsyncStorage.setItem("pusher", JSON.stringify(action.payload.isLoggedIn));
        }
    }
});

export const { setPusher } = PusherSlice.actions;

export const selectPusher = (state) => state.Pusher.pusher;
// export const selectAppVersion = (state) => state.Auth.selectAppVersion;

export default PusherSlice.reducer;