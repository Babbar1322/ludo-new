import React, {useEffect, useRef, useState} from 'react';
import {View, Text, ImageBackground, Image, BackHandler, AppState, Alert} from 'react-native';
import AnimatedLottieView from 'lottie-react-native';
import io from 'socket.io-client';
// import RNRestart from 'react-native-restart';
import axios from 'axios';
import {useSelector} from 'react-redux';
import BackgroundTimer from 'react-native-background-timer';

import BG from '../Assets/Images/GridBG.png';
import Avatar1 from '../Assets/Avatars/Avatar1.png';
import Avatar2 from '../Assets/Avatars/Avatar2.png';
import Avatar3 from '../Assets/Avatars/Avatar3.png';
import Avatar4 from '../Assets/Avatars/Avatar4.png';
import Avatar5 from '../Assets/Avatars/Avatar5.png';
import Avatar6 from '../Assets/Avatars/Avatar6.png';
import Avatar7 from '../Assets/Avatars/Avatar7.png';
import Avatar8 from '../Assets/Avatars/Avatar8.png';

import DiceLoading from '../Assets/Lotties/DiceLoading.json';
import {selectUser} from '../Redux/Slices/AuthSlice';
import {SW, c} from '../Config/Config';
import s from '../Config/Styles';
import Popup from '../Components/Popup';
import {Button} from 'react-native-paper';
import {GAME_API, SOCKET_API} from '../Game/Utils/constants';
import BgMusic from '../Game/Components/BgMusic';
import socket from '../Game/Components/Socket';

export default function Matchmaking({route, navigation}) {
	const {insertId} = route.params;
	const user = useSelector(selectUser);
	const roomId = '' + user.id;
	const [loading, setLoading] = useState(false);
	const [userData, setUserData] = useState(null);
	const [visible, setVisible] = useState(false);
	const [popupVisible, setPopupVisible] = useState(false);
	const [statusText, setStatusText] = useState('Finding Best Match...');
	// const timer = useRef(15);
	const [timer, setTimer] = useState(50);
	const timerId = useRef(null);

	const renderImage = image => {
		switch (image) {
			case 'Avatar1':
				return Avatar1;
			case 'Avatar2':
				return Avatar2;
			case 'Avatar3':
				return Avatar3;
			case 'Avatar4':
				return Avatar4;
			case 'Avatar5':
				return Avatar5;
			case 'Avatar6':
				return Avatar6;
			case 'Avatar7':
				return Avatar7;
			case 'Avatar8':
				return Avatar8;
		}
	};

	const handleUnsubscribe = async () => {
		try {
			if (!navigation.isFocused()) {
				// console.log(navigation.isFocused());
				return;
			}
			setLoading(true);
			const res = await axios.post(GAME_API + 'updateStatus', {
				id: insertId,
			});
			if (res.status === 200) {
				navigation.navigate('Home');
				setVisible(false);
			}
		} catch (err) {
			console.log('Unsubscribe Error -', err);
		} finally {
			setLoading(false);
		}
	};

	const handleBackPress = () => {
		setVisible(true);
		return true;
	};

	const handleHomePress = async () => {
		try {
			if (!navigation.isFocused()) {
				// console.log(navigation.isFocused());
				return;
			}
			const res = await axios.post(GAME_API + 'changeStatus', {
				user_id: user.id,
			});
			console.log(res.data);
			if (res.status === 200) {
				navigation.navigate('Home');
			}
		} catch (err) {
			console.log(err);
		}
	};

	const handleAppState = state => {
		// alert('Home Button Pressed');
		if (state === 'background' || state === 'inactive') {
			handleHomePress();
		}
	};

	useEffect(() => {
		// socket.on('connect', () => {
		socket.emit('createRoom', roomId);
		// });
		socket.on('roomsList', data => console.log(data));
		socket.on('roomMessage', data => {
			console.log(data);
			if (data.typee === 'joining') {
				setStatusText('Entering Game...');
				BgMusic.pause();
				navigation.navigate('Blue', {
					player1: {
						id: user.id,
						name: user.name,
						avatar: user.image,
					},
					player2: {
						name: data.user[0].name,
						avatar: data.user[0].image,
					},
					insertId,
					gameId: data.game_id,
					pawn: data.pawn2,
					pawn2: data.pawn,
					playerTurn: 'blue',
					bet: data.package,
					user: {id: user.id},
				});
			}
		});
		timerId.current = BackgroundTimer.setInterval(() => {
			setTimer(prev => {
				if (prev <= 1) {
					if (navigation.isFocused()) {
						setPopupVisible(true);
					}
					// console.log(prev);
					BackgroundTimer.clearInterval(timerId.current);
				}
				return prev - 1;
			});
		}, 1000);

		socket.connect();
		BackHandler.addEventListener('hardwareBackPress', handleBackPress);

		const subscription = AppState.addEventListener('change', state => {
			if (state === 'background' || state === 'inactive') {
				handleHomePress();
			}
		});

		return () => {
			socket.off();
			// socket.disconnect();
			subscription.remove();
			// unsub.remove();
			// AppState.removeEventListener('change', handleAppState);
			BackgroundTimer.clearInterval(timerId.current);
			BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
		};
	}, []);

	// useEffect(() => {
	// 	socket.on('roomMessage', data => {
	// 		console.log(data, 'Socket Response');
	// 		if (data.typee === 'joining') {
	// 			setStatusText('Entering Game...');
	// 			BgMusic.pause();
	// 			navigation.navigate('Blue', {
	// 				player1: {
	// 					id: user.id,
	// 					name: user.name,
	// 					avatar: user.image,
	// 				},
	// 				player2: {
	// 					name: data.user[0].name,
	// 					avatar: data.user[0].image,
	// 				},
	// 				insertId,
	// 				gameId: data.game_id,
	// 				pawn: data.pawn2,
	// 				pawn2: data.pawn,
	// 				playerTurn: 'blue',
	// 				bet: data.package,
	// 				user: {id: user.id},
	// 			});
	// 		}
	// 	});

	// 	return () => {
	// 		socket.off('roomList');
	// 	};
	// }, [socket]);
	return (
		<ImageBackground source={BG} style={{flex: 1, justifyContent: 'center'}}>
			<Popup
				closeButton
				icon='alert'
				visible={popupVisible}
				color={c.yellow}
				title={'Time Up'}
				onClose={() => {
					setPopupVisible(false);
					navigation.navigate('Home');
				}}>
				<Text style={[s.textCenter, s.textWhite, s.bold, {fontSize: 15, marginBottom: '5%'}]}>No User is Active{'\n'}If You want to continue please retry.</Text>
				<Button
					mode='contained'
					color={c.yellow}
					disabled={loading}
					onPress={() => {
						setPopupVisible(false);
						navigation.navigate('Home');
					}}>
					Retry
				</Button>
			</Popup>
			<Popup color={c.yellow} icon='alert' closeButton onClose={() => setVisible(false)} visible={visible} title={'Are You Sure?\nYou Want to Go Back?'}>
				<View style={[s.row, s.justifyAround]}>
					<Button mode='contained' color={c.yellow} disabled={loading} onPress={() => setVisible(false)}>
						Cancel
					</Button>
					<Button mode='outlined' color={c.yellow} disabled={loading} loading={loading} style={{borderColor: c.yellow}} onPress={handleUnsubscribe}>
						Go Back
					</Button>
				</View>
			</Popup>
			<Text style={{color: '#fff', fontSize: 25, letterSpacing: 2, textAlign: 'center', marginBottom: '15%', fontFamily: 'DailyHours'}}>Matchmaking</Text>
			<View style={[s.row, s.justifyAround]}>
				<View style={s.alignCenter}>
					<Image source={renderImage(user.image)} style={{backgroundColor: '#fff', borderRadius: 200, width: SW / 5, height: SW / 5}} />
					<Text style={[s.textWhite, s.bold, {marginTop: '2%'}]}>{user.name}</Text>
				</View>
				<View style={s.alignCenter}>
					<Image
						source={userData ? (userData.image_type === 'Avatar' ? renderImage(userData.image) : {uri: userData.image}) : require('../Assets/Avatars/NoUser.jpg')}
						style={{backgroundColor: '#fff', borderRadius: 200, width: SW / 5, height: SW / 5}}
					/>
					<Text style={[s.textWhite, s.bold, {marginTop: '2%'}]}>{userData ? userData.name : 'Searching...'}</Text>
				</View>
			</View>
			{/* <TouchableOpacity onPress={() => RNRestart.Restart()} style={{backgroundColor: '#fff', alignSelf: 'center'}}>
				<Text>Refresh</Text>
			</TouchableOpacity> */}
			<View style={{alignSelf: 'center', bottom: '10%', position: 'absolute', alignItems: 'center'}}>
				<AnimatedLottieView source={DiceLoading} loop autoPlay autoSize />
				<Text style={[s.textWhite, {fontFamily: 'DailyHours', fontSize: 18, letterSpacing: 2}]}>{timer}</Text>
				<Text style={[s.textWhite, {fontFamily: 'DailyHours', fontSize: 18, letterSpacing: 2}]}>{statusText}</Text>
			</View>
		</ImageBackground>
	);
}
