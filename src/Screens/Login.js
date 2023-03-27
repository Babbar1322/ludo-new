import React, {useState} from 'react';
import {View, ScrollView, ImageBackground, Image, TouchableOpacity, Keyboard, Alert} from 'react-native';
import {TextInput, Text, Button} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import axios from 'axios';

import s from '../Config/Styles';
import BG from '../Assets/Images/GridBG.png';
import {api, c} from '../Config/Config';
import Logo from '../Assets/Images/Logo.png';
import {setLogin} from '../Redux/Slices/AuthSlice';
import Popup from '../Components/Popup';
import {Icon} from 'react-native-elements';
import {getUniqueId} from 'react-native-device-info';
// import { Icon } from 'react-native-elements';

export default function Login({navigation}) {
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(false);
	// const [response, setResponse] = useState({ icon: 'check-circle', color: '#00ff00', message: "Hello" });
	const [visible, setVisible] = useState(false);
	const [response, setResponse] = useState({});
	const [userName, setUserName] = useState('');
	const [password, setPassword] = useState('');

	const handleLogin = async () => {
		try {
			setLoading(true);
			let deviceId = await getUniqueId();
			Keyboard.dismiss();
			const res = await axios.post(api + 'login', {
				email: userName,
				password,
				device_id: deviceId,
			});
			// console.log(res.data);
			if (res.data.status === 0) {
				setResponse({title: 'Error', message: res.data.message, icon: 'x', color: 'red'});
				setVisible(true);
				// Alert.alert('Error', res.data.message);
			}
			if (res.data.status === 1) {
				dispatch(setLogin({user: res.data.data, isLoggedIn: true}));
			}
		} catch (err) {
			console.log(err);
		} finally {
			setLoading(false);
		}
	};

	// const handleResponse = async (icon, color, message) => {
	//     try {
	//         setResponse(icon, color, message);
	//     } catch (err) {
	//         console.log(err)
	//     }
	// }
	return (
		<View style={{flex: 1}}>
			<ImageBackground source={BG} style={{flex: 1, paddingHorizontal: '5%'}}>
				<Popup visible={visible} closeButton={true} onClose={() => setVisible(false)} icon={response.icon} color={response.color} title={response.title}>
					<Text style={[s.textWhite, s.bold]}>{response.message}</Text>
				</Popup>
				<ScrollView style={{flex: 1}} keyboardShouldPersistTaps='handled'>
					<Image source={Logo} style={{width: 200, height: 200, resizeMode: 'contain', alignSelf: 'center', marginTop: '25%'}} />
					<View style={{backgroundColor: '#ffffff50', paddingHorizontal: '5%', paddingVertical: '8%', borderRadius: 15}}>
						{/* <View style={[s.row, { padding: '2%', backgroundColor: response.color, opacity: 0.3 }]}>
                            <Icon name={response.icon} size={30} color={response.color} />
                            <Text style={[s.bold, { color: response.color }]}>{response.message}</Text>
                        </View> */}
						<TextInput
							placeholder='UserID or E-Mail'
							mode='outlined'
							outlineColor={c.green}
							style={{marginBottom: '3%'}}
							activeOutlineColor={c.darkGreen}
							onChangeText={e => setUserName(e)}
							value={userName}
							autoCapitalize='none'
						/>
						<TextInput
							placeholder='Password'
							mode='outlined'
							secureTextEntry
							outlineColor={c.green}
							activeOutlineColor={c.darkGreen}
							onChangeText={e => setPassword(e)}
							value={password}
						/>
						<TouchableOpacity style={{alignSelf: 'flex-end', marginTop: '3%', marginBottom: '5%'}}>
							<Text style={[s.textWhite, s.bold]}>Forgot Password?</Text>
						</TouchableOpacity>
						<Button mode='contained' onPress={handleLogin} loading={loading} color={c.green} children='Login' labelStyle={[s.textWhite, s.bold]} disabled={loading} />
					</View>
				</ScrollView>
				<Button color={c.white} labelStyle={s.bold} style={{marginBottom: '3%'}} onPress={() => navigation.navigate('Signup')}>
					Don't Have an Account? Signup
				</Button>
			</ImageBackground>
		</View>
	);
}
