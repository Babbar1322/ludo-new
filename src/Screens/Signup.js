import React, {useState} from 'react';
import {View, ScrollView, ImageBackground, Image, Keyboard, Alert, ToastAndroid} from 'react-native';
import {TextInput, Text, Button, IconButton} from 'react-native-paper';
import axios from 'axios';
import {useDispatch} from 'react-redux';
import Popup from '../Components/Popup';

import s from '../Config/Styles';
import BG from '../Assets/Images/GridBG.png';
import {api, c} from '../Config/Config';
import Logo from '../Assets/Images/Logo.png';
import {setLogin} from '../Redux/Slices/AuthSlice';
import Clipboard from '@react-native-community/clipboard';
import {getUniqueId} from 'react-native-device-info';

export default function Signup({navigation}) {
	const dispatch = useDispatch();

	const [name, setName] = useState('');
	const [phone, setPhone] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [spUID, setSpUID] = useState('');
	const [spName, setSpName] = useState('');

	const [userData, setUserData] = useState({});
	const [response, setResponse] = useState({});
	const [visible, setVisible] = useState(false);

	const [loading, setLoading] = useState(false);

	const getUserName = async id => {
		try {
			const res = await axios.post(api + 'getName', {
				uid: id,
			});
			// console.log(res.data);
			if (res.data.status === 0) {
				setSpName('User Not Found!');
				return;
			}
			setSpName(res.data);
		} catch (err) {
			console.log(err);
		}
	};

	const handleSignup = async () => {
		try {
			if (!/^[6-9]\d{9}$/.test(phone)) {
				Alert.alert('Error', 'Please Enter a Valid Phone Number.');
				return;
			}
			if (
				!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)
			) {
				Alert.alert('Error', 'Please Enter a Valid Email Address.');
				return;
			}
			if ((!name, !password, !spUID)) {
				Alert.alert('Error', 'Please Fields are Required!');
				return;
			}
			setLoading(true);
			let deviceId = await getUniqueId();
			Keyboard.dismiss();
			const res = await axios.post(api + 'register', {
				name,
				phone,
				email,
				password,
				spid: spUID,
				device_id: deviceId,
			});
			// console.log(res.data);
			if (res.data.status === 0) {
				setResponse({title: 'Error', color: 'red', icon: 'x', message: res.data.message, closeBtn: true});
				setVisible(true);
			}
			if (res.data.status === 1) {
				setResponse({title: 'Hi, ' + res.data.data.name, color: c.green, icon: 'check', message: 'You are Successfully Registered', closeBtn: false});
				setVisible(true);
				setUserData(res.data.data);
				// dispatch(setLogin({ isLoggedIn: true, user: res.data.data }));
			}
		} catch (err) {
			console.log(err);
		} finally {
			setLoading(false);
		}
	};
	return (
		<View style={{flex: 1}}>
			<ImageBackground source={BG} style={{flex: 1, paddingHorizontal: '5%'}}>
				<Popup visible={visible} closeButton={response.closeBtn} onClose={() => setVisible(false)} icon={response.icon} color={response.color} title={response.title}>
					{response.message && (
						<Text style={[s.bold, s.textCenter, {textTransform: 'capitalize', color: c.yellow, fontSize: 18, marginVertical: '2%'}]}>{response.message}</Text>
					)}
					{response.color === c.green && (
						<View>
							<View style={s.smallList}>
								<Text style={[s.textWhite, s.bold]}>Sponsor ID - {userData.spid}</Text>
							</View>
							<View style={s.smallList}>
								<Text style={[s.textWhite, s.bold]}>Name - {userData.name}</Text>
							</View>
							<View style={s.smallList}>
								<Text style={[s.textWhite, s.bold]}>UserID - {userData.uid}</Text>
								<IconButton
									icon='content-copy'
									color={c.white}
									size={20}
									style={{padding: 0, margin: 0}}
									onPress={() => {
										Clipboard.setString(userData.uid);
										ToastAndroid.show('UserID Copied Successfully', 1000);
									}}
								/>
							</View>
							<View style={s.smallList}>
								<Text style={[s.textWhite, s.bold]}>Email - {userData.email}</Text>
							</View>
							<View style={s.smallList}>
								<Text style={[s.textWhite, s.bold]}>Phone - {userData.phone}</Text>
							</View>
							<Button mode='contained' color={c.green} onPress={() => dispatch(setLogin({user: userData, isLoggedIn: true}))} style={{marginTop: '5%'}}>
								Ok
							</Button>
						</View>
					)}
				</Popup>
				<ScrollView style={{flex: 1}} keyboardShouldPersistTaps='handled'>
					<Image
						source={Logo}
						style={{
							width: 200,
							height: 200,
							resizeMode: 'contain',
							alignSelf: 'center',
							marginTop: '5%',
						}}
					/>
					<View
						style={{
							backgroundColor: '#ffffff50',
							paddingHorizontal: '5%',
							paddingVertical: '8%',
							borderRadius: 15,
						}}>
						<TextInput
							placeholder='Referral ID'
							mode='outlined'
							outlineColor={c.yellow}
							style={{marginBottom: '3%'}}
							activeOutlineColor={c.darkYellow}
							onChangeText={e => {
								getUserName(e);
								setSpUID(e);
							}}
							// onBlur={() => getUserName(spUID)}
							value={spUID}
							autoCapitalize='characters'
						/>
						{spName && <Text style={{marginBottom: '3%', color: c.white}}>{spName}</Text>}
						<TextInput
							placeholder='Name'
							mode='outlined'
							outlineColor={c.yellow}
							style={{marginBottom: '3%'}}
							activeOutlineColor={c.darkYellow}
							autoCapitalize='words'
							autoComplete='name'
							onChangeText={e => setName(e)}
							value={name}
						/>
						<TextInput
							placeholder='Phone Number'
							mode='outlined'
							outlineColor={c.yellow}
							style={{marginBottom: '3%'}}
							activeOutlineColor={c.darkYellow}
							keyboardType='phone-pad'
							autoComplete='tel'
							maxLength={10}
							onChangeText={e => setPhone(e)}
						/>
						<TextInput
							placeholder='E-Mail Address'
							mode='outlined'
							outlineColor={c.yellow}
							style={{marginBottom: '3%'}}
							activeOutlineColor={c.darkYellow}
							autoCapitalize='none'
							autoComplete='email'
							keyboardType='email-address'
							onChangeText={e => setEmail(e)}
							value={email}
						/>
						<TextInput
							placeholder='Password'
							mode='outlined'
							secureTextEntry
							outlineColor={c.yellow}
							activeOutlineColor={c.darkYellow}
							onChangeText={e => setPassword(e)}
							value={password}
						/>
						<Button
							mode='contained'
							color={loading ? c.white : c.yellow}
							style={{marginTop: '5%'}}
							labelStyle={[s.bold]}
							loading={loading}
							disabled={loading}
							onPress={handleSignup}>
							{' '}
							Signup{' '}
						</Button>
					</View>
				</ScrollView>
				<Button color={c.white} labelStyle={s.bold} style={{marginBottom: '3%'}} onPress={() => navigation.navigate('Login')} children='Already Have an Account? Login' />
			</ImageBackground>
		</View>
	);
}
