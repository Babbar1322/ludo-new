import React, {useEffect, useState} from 'react';

// Navigators
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// Packages
import {Provider, useSelector} from 'react-redux';
import {useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from 'react-native-splash-screen';
import axios from 'axios';
import {Alert, Linking, Text, AppState} from 'react-native';
import {Button} from 'react-native-paper';

// Screens
import Login from './src/Screens/Login';
import Signup from './src/Screens/Signup';
import Home from './src/Screens/Home';
import LevelIncome from './src/Screens/LevelIncome';
import Downline from './src/Screens/Downline';
import Directs from './src/Screens/Directs';
import Withdrawals from './src/Screens/Withdrawals';
import WalletDetails from './src/Screens/WalletDetails';
import TransactionHistory from './src/Screens/TransactionHistory';
import MenuModal from './src/Screens/MenuModal';
import ProfileMenu from './src/Screens/ProfileMenu';
import AddCoins from './src/Screens/AddCoins';
import Withdraw from './src/Screens/Withdraw';
import Membership from './src/Screens/Membership';
import ActivationHistory from './src/Screens/ActivationHistory';
import AddCoinHistory from './src/Screens/AddCoinHistory';
import Game from './src/Screens/Game';
import Game2 from './src/Screens/Game2';
import GameOptions from './src/Screens/GameOptions';
import Matchmaking from './src/Screens/Matchmaking';
import GameLevelIncome from './src/Screens/GameLevelIncome';
import GameRecords from './src/Screens/GameRecords';
import GameCopy from './src/Screens/GameCopy';
import Settings from './src/Screens/Settings';
import GamePure from './src/Screens/GamePure';
import Blue from './src/Screens/Blue';
import SocketTest from './src/Screens/SocketTest';
import Green from './src/Screens/Green';

// Components
import {Store} from './src/Redux/Store';
import {selectIsLoggedIn} from './src/Redux/Slices/AuthSlice';
import {startUp} from './src/Redux/Slices/AuthSlice';
import s from './src/Config/Styles';
import {api, c, CurrentAppVersion} from './src/Config/Config';
import Popup from './src/Components/Popup';
import Sound from 'react-native-sound';
import BgMusic from './src/Game/Components/BgMusic';
import {selectIsMusicPlaying, setMusic} from './src/Redux/Slices/GameSlice';
import GameBoard from './src/Game/Components/GameBoard';
Sound.setCategory('Playback', true);

export default function Wrapper() {
	// SplashScreen.hide();
	return (
		<Provider store={Store}>
			<App />
			{/* <GameBoard /> */}
		</Provider>
	);
}

function App() {
	const isLoggedIn = useSelector(selectIsLoggedIn);
	const isPlaying = useSelector(selectIsMusicPlaying);
	const dispatch = useDispatch();
	const [response, setResponse] = useState({});
	const [visible, setVisible] = useState(false);

	// const Stack = createStackNavigator();
	const Stack = createNativeStackNavigator();

	useEffect(() => {
		const prepare = async () => {
			try {
				const res = await axios.get(api + 'getAppVersion');
				if (res.data.version !== CurrentAppVersion) {
					setResponse({color: 'red', link: res.data.url});
					setVisible(true);
				}
				let loginState = await AsyncStorage.getItem('isLoggedIn');
				let user = await AsyncStorage.getItem('user');
				let music = await AsyncStorage.getItem('music');
				dispatch(
					startUp({
						isLoggedIn: JSON.parse(loginState),
						user: JSON.parse(user),
					})
				);
				dispatch(setMusic(JSON.parse(music)));
			} catch (err) {
				console.warn(err);
				Alert.alert('Network Error', 'Please Check Your Internet Connection!');
				let loginState = await AsyncStorage.getItem('isLoggedIn');
				let user = await AsyncStorage.getItem('user');
				dispatch(
					startUp({
						isLoggedIn: JSON.parse(loginState),
						user: JSON.parse(user),
					})
				);
			} finally {
				setTimeout(() => {
					SplashScreen.hide();
				}, 500);
			}
		};
		prepare();
	}, []);
	useEffect(() => {
		const subscription = AppState.addEventListener('change', state => {
			// console.log(isPlaying, 'Is Music Playin');
			AsyncStorage.getItem('music', (_err, res) => {
				if (res !== null) {
					const music = JSON.parse(res);
					console.log(music, typeof music, 'Music');

					if (state === 'active' && music) {
						BgMusic.play();
					}
				} else {
					if (state === 'active' && isLoggedIn) {
						BgMusic.play();
					}
				}
			});
			if (state === 'background' || state === 'inactive') {
				BgMusic.pause();
			}
		});

		return () => {
			subscription.remove();
			// console.log('Listener Removed', rem, subscription);
		};
	}, [isPlaying]);
	return (
		<NavigationContainer>
			<Popup color="red" onClose={null} visible={visible} title="Update Available" icon="x">
				<Text style={[s.textWhite, s.bold]}>This app is Outdated. Please Update the App.</Text>
				<Button mode="contained" onPress={() => Linking.openURL(response.link)} style={{alignSelf: 'flex-end', marginVertical: '5%'}} color={c.yellow}>
					Update
				</Button>
			</Popup>
			<Stack.Navigator
				screenOptions={{
					headerShown: false,
					// cardStyleInterpolator: CardStyleInterpolators.forBottomSheetAndroid,
					// animation: 'fade_from_bottom',
				}}>
				{isLoggedIn ? (
					<>
						<Stack.Group screenOptions={{presentation: 'transparentModal', animation: 'slide_from_left'}}>
							<Stack.Screen name="Home" component={Home} />
							<Stack.Screen name="MenuModal" component={MenuModal} />
							<Stack.Screen name="ProfileMenu" component={ProfileMenu} />
							<Stack.Screen name="AddCoins" component={AddCoins} />
							<Stack.Screen name="Withdraw" component={Withdraw} />
							<Stack.Screen name="Membership" component={Membership} />
							<Stack.Screen name="GameOptions" component={GameOptions} />
							<Stack.Screen name="Settings" component={Settings} />
						</Stack.Group>
						<Stack.Group>
							<Stack.Screen name="LevelIncome" component={LevelIncome} />
							<Stack.Screen name="Downline" component={Downline} />
							<Stack.Screen name="Directs" component={Directs} />
							<Stack.Screen name="Withdrawals" component={Withdrawals} />
							<Stack.Screen name="TransactionHistory" component={TransactionHistory} />
							<Stack.Screen name="WalletDetails" component={WalletDetails} />
							<Stack.Screen name="ActivationHistory" component={ActivationHistory} />
							<Stack.Screen name="AddCoinHistory" component={AddCoinHistory} />
							<Stack.Screen name="GameLevelIncome" component={GameLevelIncome} />
							<Stack.Screen name="GameRecords" component={GameRecords} />
						</Stack.Group>
						<Stack.Group>
							<Stack.Screen name="Game" component={Game} />
							<Stack.Screen name="GamePure" component={GamePure} />
							<Stack.Screen name="Game2" component={Game2} />
							<Stack.Screen name="Blue" component={Blue} />
							<Stack.Screen name="Green" component={Green} />
							<Stack.Screen name="Matchmaking" component={Matchmaking} />
							<Stack.Screen name="GameCopy" component={GameCopy} />
							<Stack.Screen name="SocketTest" component={SocketTest} />
						</Stack.Group>
					</>
				) : (
					<>
						<Stack.Screen name="Login" component={Login} />
						<Stack.Screen name="Signup" component={Signup} />
					</>
				)}
			</Stack.Navigator>
		</NavigationContainer>
	);
}
