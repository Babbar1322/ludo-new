import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {View, Image, ActivityIndicator, ImageBackground, ToastAndroid} from 'react-native';
import {Button, IconButton, Text, TextInput} from 'react-native-paper';
import {useSelector} from 'react-redux';
import Clipboard from '@react-native-community/clipboard';

import Logo from '../Assets/Images/Logo.png';
import BG from '../Assets/Images/GridBG.png';
import {api, c} from '../Config/Config';
import s from '../Config/Styles';
import {selectUser} from '../Redux/Slices/AuthSlice';
import Popup from '../Components/Popup';

export default function Membership({navigation}) {
	const [membershipPackage, setMembershipPackage] = useState({});
	const [balance, setBalance] = useState(0);
	const [userID, setUserID] = useState('');
	const user = useSelector(selectUser);
	const [loading, setLoading] = useState(false);

	const [response, setResponse] = useState({});
	const [visible, setVisible] = useState(false);
	const [userData, setUserData] = useState({});
	const [btnDisable, setBtnDisable] = useState(true);
	const [userName, setUserName] = useState('');

	const getPackage = async () => {
		try {
			setLoading(true);
			const res = await axios.get(api + 'packages');
			if (res.data.status === 1) {
				setMembershipPackage(res.data.packages);
			}
		} catch (err) {
			console.log(err);
		} finally {
			setLoading(false);
		}
	};

	const getEpinBalance = async () => {
		try {
			setLoading(true);
			const res = await axios.post(api + 'userBalance', {
				type: 'epin',
				user_token: user.user_token,
			});
			// console.log(res.data);
			if (res.data.status === 1) {
				setBalance(res.data.balance);
			}
		} catch (err) {
			console.log(err);
		} finally {
			setLoading(false);
		}
	};

	const getName = async e => {
		try {
			const res = await axios.post(api + 'getName', {
				uid: e,
			});
			// console.log(res.data);
			if (res.data.status === 0) {
				setUserName('No User Found');
				setBtnDisable(true);
				return;
			}
			setUserName(res.data);
			setBtnDisable(false);
		} catch (err) {
			console.log(err);
		}
	};

	const handleActivatePackage = async () => {
		try {
			setLoading(true);
			const res = await axios.post(api + 'activatePackage', {
				user_token: user.user_token,
				package_id: membershipPackage.id,
				uid: userID,
			});
			// console.log(res.data);
			if (res.data.status === 0) {
				setResponse({title: 'Error', color: 'red', icon: 'x', message: res.data.message});
				setVisible(true);
			}
			if (res.data.status === 1) {
				setResponse({title: 'Congratulations! Your ID is Activated.', color: c.green, icon: 'check', message: res.data.message});
				setUserData(res.data.data);
				setVisible(true);
			}
		} catch (err) {
			console.log(err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		getPackage();
		getEpinBalance();
	}, []);
	return (
		<View style={s.modalBg}>
			<ImageBackground source={BG} style={s.popUpBg} imageStyle={{borderRadius: 20, borderColor: c.yellow, borderWidth: 2}}>
				<Popup
					closeButton
					color={response.color}
					icon={response.icon}
					onClose={() => {
						setVisible(false);
						navigation.navigate('ActivationHistory');
					}}
					title={response.title}
					visible={visible}>
					{response.message && <Text style={[s.bold, s.textWhite]}>{response.message}</Text>}
					{response.color === c.green && (
						<View>
							<View style={s.smallList}>
								<Text style={[s.textWhite, s.bold]}>Name - {userData.name}</Text>
							</View>
							<View style={s.smallList}>
								<Text style={[s.textWhite, s.bold]}>User ID - {userData.uid}</Text>
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
								<Text style={[s.textWhite, s.bold]}>Package - {membershipPackage?.amount}</Text>
							</View>
							<View style={s.smallList}>
								<Text style={[s.textWhite, s.bold]}>
									Activation Date -{' '}
									{new Date(userData.activation_date ?? userData.updated_at).toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit', hour12: false}) +
										' ' +
										new Date(userData.activation_date ?? userData.updated_at).toLocaleDateString()}
								</Text>
							</View>
						</View>
					)}
				</Popup>
				<Image source={Logo} style={s.menuTopImage} />
				<IconButton icon='close' color='#000' style={{backgroundColor: c.yellow, position: 'absolute', right: -20, top: -20}} onPress={() => navigation.goBack()} />
				<Text style={[s.textWhite, {textAlign: 'right'}]}>E-Wallet: {balance}</Text>
				<Text style={[s.textCenter, s.bold, {fontSize: 25, color: c.yellow}]}>Activation</Text>
				<Text style={[s.textCenter, s.textWhite, s.bold, {fontSize: 18, marginBottom: '5%'}]}>Gold Membership</Text>
				{loading ? (
					<ActivityIndicator color={c.yellow} size='large' />
				) : (
					<>
						<Text style={[s.textCenter, s.textWhite, s.bold, {fontSize: 20}]}>Package Amount</Text>
						<Text style={[s.textCenter, s.textWhite, s.bold, {fontSize: 20}]}>₹{membershipPackage?.amount}</Text>
						<TextInput
							placeholder='Enter User ID'
							activeUnderlineColor={c.yellow}
							style={{height: 40, backgroundColor: c.white, marginVertical: '3%'}}
							autoCapitalize='characters'
							onChangeText={e => {
								getName(e);
								setUserID(e);
							}}
							value={userID}
						/>
						{userName && <Text style={[s.bold, s.textWhite]}>{userName}</Text>}
					</>
				)}
				<Button
					mode='contained'
					disabled={btnDisable}
					style={{marginTop: '5%', paddingHorizontal: '10%', alignSelf: 'center'}}
					color={loading ? c.darkYellow : c.yellow}
					onPress={handleActivatePackage}>
					Purchase Now
				</Button>
			</ImageBackground>
		</View>
	);
}
