import React, {useEffect, useState} from 'react';
import {View, Image, TouchableOpacity, Alert, ActivityIndicator, ToastAndroid, ScrollView, ImageBackground} from 'react-native';
import {Avatar, IconButton, Text} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import Clipboard from '@react-native-community/clipboard';

import Logo from '../Assets/Images/Logo.png';
import BG from '../Assets/Images/GridBG.png';
import {selectUser, setBalance, setLogout, setUser} from '../Redux/Slices/AuthSlice';
import {api, c} from '../Config/Config';
import s from '../Config/Styles';
import axios from 'axios';
import {Icon} from 'react-native-elements';

import Avatar1 from '../Assets/Avatars/Avatar1.png';
import Avatar2 from '../Assets/Avatars/Avatar2.png';
import Avatar3 from '../Assets/Avatars/Avatar3.png';
import Avatar4 from '../Assets/Avatars/Avatar4.png';
import Avatar5 from '../Assets/Avatars/Avatar5.png';
import Avatar6 from '../Assets/Avatars/Avatar6.png';
import Avatar7 from '../Assets/Avatars/Avatar7.png';
import Avatar8 from '../Assets/Avatars/Avatar8.png';
import ListItem from '../Components/ListItem';

export default function ProfileMenu({navigation}) {
	const dispatch = useDispatch();
	const user = useSelector(selectUser);

	const [details, setDetails] = useState({});

	const [loading, setLoading] = useState(false);

	const avatarIntials = () => {
		const name = user?.name?.split(' ');
		if (name?.length > 1) {
			return name.shift().charAt(0) + name.pop().charAt(0);
		} else {
			return name?.shift()?.charAt(0);
		}
	};

	const handleLogout = async () => {
		try {
			Alert.alert('Logout!', 'Are you sure you want to Logout?', [
				{
					text: 'Cancel',
					onPress: () => null,
					style: 'cancel',
				},
				{
					text: 'YES',
					onPress: () => dispatch(setLogout()),
				},
			]);
			return true;
		} catch (err) {
			console.log(err);
		}
	};

	const getImage = () => {
		if (user.image_type === 'Avatar') {
			switch (user.image) {
				case 'Avatar1': {
					return Avatar1;
				}
				case 'Avatar2': {
					return Avatar2;
				}
				case 'Avatar3': {
					return Avatar3;
				}
				case 'Avatar4': {
					return Avatar4;
				}
				case 'Avatar5': {
					return Avatar5;
				}
				case 'Avatar6': {
					return Avatar6;
				}
				case 'Avatar7': {
					return Avatar7;
				}
				case 'Avatar8': {
					return Avatar8;
				}
				default: {
					return Avatar1;
				}
			}
			// return user.image
		} else {
			return {uri: user.image};
		}
	};

	const getUserDetails = async () => {
		try {
			const res = await axios.post(api + 'getUserDetails', {
				user_token: user.user_token,
			});
			// console.log(res.data);
			dispatch(setUser({user: res.data.users}));
		} catch (err) {
			console.log(err);
		}
	};

	const getDetails = async () => {
		try {
			setLoading(true);
			const res = await axios.post(api + 'details', {
				user_token: user.user_token,
			});
			// console.log(res.data);
			if (res.status === 200) {
				setDetails(res.data);
				dispatch(setBalance(res.data.balance));
			}
		} catch (err) {
			console.log(err);
			if (err.toString().endsWith('401')) {
				Alert.alert('Error', 'We got some error while fetching your Details!');
			}
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		getDetails();
		getUserDetails();
	}, []);

	return (
		<View style={s.modalBg}>
			<ImageBackground source={BG} style={s.popUpBg} imageStyle={{borderRadius: 20, borderColor: c.yellow, borderWidth: 2}}>
				<Image source={Logo} style={s.menuTopImage} />
				<IconButton icon='close' color='#000' style={{backgroundColor: c.yellow, position: 'absolute', right: -20, top: -20}} onPress={() => navigation.goBack()} />
				<View style={[s.row, s.justifyCenter]}>
					<View>
						{user.image_type === 'Avatar' ? (
							<Image
								source={getImage()}
								style={{width: 70, height: 70, borderRadius: 50, borderColor: c.yellow, borderWidth: 1.5, backgroundColor: c.white, alignSelf: 'center'}}
							/>
						) : (
							<Avatar.Text label={avatarIntials()} size={50} style={{borderColor: c.yellow, borderWidth: 1.5, backgroundColor: '#410B00', alignSelf: 'center'}} />
						)}
						<Text style={[s.textCenter, s.bold, {color: user.is_active ? c.green : 'red'}]}>{user.is_active ? 'Active' : 'Not Active'}</Text>
					</View>
					<View style={{marginLeft: '5%'}}>
						<Text style={[s.bold, s.textWhite, {fontSize: 18}]}>{user.name}</Text>
						<Text style={[s.bold, s.textWhite, {fontSize: 18, textAlignVertical: 'center'}]}>
							{user.uid}{' '}
							<IconButton
								icon='content-copy'
								color='#000'
								size={18}
								style={{backgroundColor: c.yellow}}
								onPress={() => {
									Clipboard.setString(user.uid);
									ToastAndroid.show('User ID Copied Successfully!', 1000);
								}}
							/>
						</Text>
						<Text style={[s.bold, s.textWhite, {fontSize: 18}]}>{user.phone}</Text>
					</View>
				</View>
				<View style={[s.row, s.justifyBetween]}>
					<View>
						<Text style={[s.textWhite]}>Registration Date -</Text>
						<Text style={s.textWhite}>
							{new Date(user.created_at).toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit', hour12: false}) +
								'  ' +
								new Date(user.created_at).toLocaleDateString()}
						</Text>
					</View>
					<View>
						<Text style={[s.textWhite]}>Activation Date -</Text>
						{user.is_active ? (
							<Text style={s.textWhite}>
								{new Date(user.activation_date ?? user.updated_at).toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit', hour12: false}) +
									'  ' +
									new Date(user.activation_date ?? user.updated_at).toLocaleDateString()}
							</Text>
						) : (
							<Text style={s.textWhite}>Not Active</Text>
						)}
					</View>
				</View>
				<ScrollView style={{height: '50%'}} showsVerticalScrollIndicator={false}>
					<ListItem onPress={() => navigation.navigate('LevelIncome')} title='Level Bonus' loading={loading} details={details.level_bonus} />
					<ListItem onPress={() => navigation.navigate('Directs')} title='Directs' loading={loading} details={details.directs} />
					<ListItem onPress={() => navigation.navigate('Downline')} title='Team' loading={loading} details={details.team} />
					<TouchableOpacity style={[s.profileMenuListItem, {paddingVertical: 0}]} activeOpacity={0.7} onPress={() => navigation.navigate('WalletDetails')}>
						<View style={s.row}>
							<Text style={s.profileMenuListText}>E-Wallet: {loading ? <ActivityIndicator size='small' color='#000' /> : details.epinBalance}</Text>
							<IconButton
								icon='plus'
								color={c.white}
								style={{backgroundColor: c.green, borderRadius: 10, marginVertical: 0}}
								onPress={() => navigation.navigate('AddCoins')}
							/>
						</View>
						<Icon name='chevron-right' type='feather' />
					</TouchableOpacity>
					<ListItem title='Ludo Bonus' loading={loading} details={20} />
					<ListItem onPress={() => navigation.navigate('TransactionHistory')} title='Balance' loading={loading} details={details.balance} />
					<ListItem
						onPress={() => navigation.navigate('GameLevelIncome')}
						title='Game Level Income'
						loading={loading}
						details={details?.totalGameLevelIncome?.toFixed(2)}
					/>
					<ListItem onPress={() => navigation.navigate('GameRecords')} title='Game Records' loading={loading} />
					<ListItem onPress={() => navigation.navigate('Withdrawals')} title='Withdrawals' loading={loading} details={details.withs} />
					<ListItem onPress={handleLogout} title='Log Out' bg={c.yellow} />
				</ScrollView>
			</ImageBackground>
		</View>
	);
}
