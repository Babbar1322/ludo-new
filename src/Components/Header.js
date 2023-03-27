import React, {useState, useEffect} from 'react';
import {View, Text, Image, TouchableOpacity, ActivityIndicator} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {selectBalance, selectUser, setBalance} from '../Redux/Slices/AuthSlice';
import {IconButton, Avatar} from 'react-native-paper';
import {Icon} from 'react-native-elements';
import axios from 'axios';

import s from '../Config/Styles';
import {SW, api, c} from '../Config/Config';

import Menu from '../Assets/Images/Menu.png';
import Home from '../Assets/Images/Home.png';
import Coin from '../Assets/Images/Coin.png';

import Avatar1 from '../Assets/Avatars/Avatar1.png';
import Avatar2 from '../Assets/Avatars/Avatar2.png';
import Avatar3 from '../Assets/Avatars/Avatar3.png';
import Avatar4 from '../Assets/Avatars/Avatar4.png';
import Avatar5 from '../Assets/Avatars/Avatar5.png';
import Avatar6 from '../Assets/Avatars/Avatar6.png';
import Avatar7 from '../Assets/Avatars/Avatar7.png';
import Avatar8 from '../Assets/Avatars/Avatar8.png';
import TS from '../Config/TS';

export default function Header({showBalance, goToHome, openMenu, addCoins, profileMenu}) {
	const dispatch = useDispatch();
	const user = useSelector(selectUser);
	const balance = useSelector(selectBalance);
	// const [balance, setBalance] = useState(0);
	const [loading, setLoading] = useState(false);

	const avatarIntials = () => {
		const name = user.name.split(' ');
		if (name.length > 1) {
			return name.shift().charAt(0) + name.pop().charAt(0);
		} else {
			return name.shift().charAt(0);
		}
	};

	const getImage = () => {
		if (user.image_type === 'Avatar') {
			switch (user.image) {
				case 'Avatar1': {
					return Avatar1;
					break;
				}
				case 'Avatar2': {
					return Avatar2;
					break;
				}
				case 'Avatar3': {
					return Avatar3;
					break;
				}
				case 'Avatar4': {
					return Avatar4;
					break;
				}
				case 'Avatar5': {
					return Avatar5;
					break;
				}
				case 'Avatar6': {
					return Avatar6;
					break;
				}
				case 'Avatar7': {
					return Avatar7;
					break;
				}
				case 'Avatar8': {
					return Avatar8;
					break;
				}
				default: {
					return Avatar1;
					break;
				}
			}
			// return user.image
		} else {
			return {uri: user.image};
		}
	};

	const getBalance = async () => {
		try {
			setLoading(true);
			const res = await axios.post(api + 'userBalance', {
				user_token: user.user_token,
			});
			// console.log(res.data);
			if (res.data.status === 0) {
				Alert.alert('Error', 'Something went wrong while fetching your balance');
			}
			if (res.data.status === 1) {
				dispatch(setBalance(res.data.balance));
			}
		} catch (err) {
			console.log(err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		getBalance();
	}, []);

	return (
		<View style={s.header}>
			{goToHome ? (
				<TouchableOpacity activeOpacity={0.7} onPress={goToHome}>
					<Image source={Home} style={s.iconImage} />
				</TouchableOpacity>
			) : (
				<TouchableOpacity activeOpacity={0.7} onPress={profileMenu}>
					{user.image_type === 'Avatar' ? (
						<Image source={getImage()} style={s.profileImage} />
					) : (
						<Avatar.Text label={avatarIntials()} size={SW / 8} style={s.avatarIntials} />
					)}
					<Text style={TS.name} numberOfLines={1}>
						{user.name}
					</Text>
				</TouchableOpacity>
			)}
			{/* {showBalance ?
                <View style={[s.row, s.justifyAround, { backgroundColor: c.white + '50', borderRadius: 10 }]}>
                    <Image source={Coin} style={s.iconImage} />
                    <View style={{ marginHorizontal: '3%' }}>
                        <Text style={[s.textWhite, s.bold]}>Your Balance</Text>
                        <Text style={[s.textWhite, s.bold]}>₹{loading ? <ActivityIndicator size='small' color={c.white} /> : balance}</Text>
                    </View>
                    <IconButton icon='plus' color={c.white} style={{ backgroundColor: c.green, borderRadius: 10 }} onPress={addCoins} />
                </View> : */}
			<View style={s.headerInner}>
				<View>
					<View style={[s.row, {marginHorizontal: '3%'}]}>
						<Icon name={user.is_active ? 'check-circle' : 'x-circle'} type='feather' size={20} color={user.is_active ? c.green : 'red'} />
						<Text style={TS.whiteBold}>{user.is_active ? 'Active' : 'Not Active'}</Text>
					</View>
					<Text style={TS.whiteBold}>Balance: ₹{loading ? <ActivityIndicator size='small' color={c.white} /> : balance}</Text>
				</View>
				<IconButton icon='plus' color={c.white} style={{backgroundColor: c.green, borderRadius: 10}} onPress={addCoins} />
			</View>
			{/* } */}
			<TouchableOpacity activeOpacity={0.7} onPress={openMenu}>
				<Image source={Menu} style={s.iconImage} />
			</TouchableOpacity>
		</View>
	);
}
