import React, {useEffect, useRef, useState} from 'react';
import {View, Text, ImageBackground, Image, TouchableOpacity, ActivityIndicator, Alert} from 'react-native';
import {Button, IconButton} from 'react-native-paper';
import axios from 'axios';
import s from '../Config/Styles';
import {api, c} from '../Config/Config';
import BG from '../Assets/Images/GridBG.png';
import Logo from '../Assets/Images/Logo.png';
import Coin from '../Assets/Images/Coin.png';
import {useDispatch, useSelector} from 'react-redux';
import {selectBalance, selectUser, setLogout} from '../Redux/Slices/AuthSlice';
import {GAME_API} from '../Game/Utils/constants';
import verifyDevice from '../Config/verifyDevice';
import {Dropdown} from 'react-native-element-dropdown';
import BgMusic from '../Game/Components/BgMusic';

export default function GameOptions({navigation}) {
	const dispatch = useDispatch();
	const balance = useSelector(selectBalance);
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);

	// const [message, setMessage] = useState('');
	// const [visible, setVisible] = useState(true);
	const [value, setValue] = useState('F');
	// const [disable, setDisable] = useState(false);
	const disable = useRef(false);

	const user = useSelector(selectUser);

	const getGamePackages = async () => {
		try {
			setLoading(true);
			// https://ludonetwork.in/admin/api/gameTestPackages
			const res = await axios.get(api + 'game_packages');
			setData(res.data.packages);
		} catch (err) {
			console.log(err);
		} finally {
			setLoading(false);
		}
	};

	const handleChooseOption = async package_id => {
		try {
			// if (balance < package_amount) {
			// 	Alert.alert('Insufficiant Balance', 'Please Add Some Balance or Choose another package');
			// 	return;
			// }
			disable.current = true;
			// console.log(GAME_API + 'add_users');
			// const res = await fetch(GAME_API + 'add_users', {
			// 	method: 'post',
			// 	headers: {
			// 		Accept: 'application/json',
			// 		'Content-Type': 'application/json',
			// 	},
			// 	body: JSON.stringify({
			// 		user_id: user.id,
			// 		package_id: package_id,
			// 		status: 0,
			// 		wallet_type: value,
			// 	}),
			// });
			const res = await axios.post(GAME_API + 'add_users', {
				user_id: user.id,
				package_id: package_id,
				status: 0,
				wallet_type: value,
			});
			// console.log(res);
			if (res.status === 200) {
				// console.log(res.data);
				BgMusic.pause();
				res.data.type === 'first_side'
					? navigation.navigate('Matchmaking', {
							insertId: res.data.id.insertId,
					  })
					: navigation.navigate('Green', {
							player1: {
								id: res.data.user[0].id,
								name: res.data.user[0].name,
								avatar: res.data.user[0].image,
							},
							player2: {
								name: user.name,
								avatar: user.image,
							},
							gameId: res.data.game_id,
							insertId: res.data.id.insertId,
							pawn: res.data.pawn,
							pawn2: res.data.pawn2,
							playerTurn: res.data.turn,
							bet: res.data.package,
							user: {id: user.id},
					  });
			}
		} catch (err) {
			console.log(err);
			// Alert.alert('Error', JSON.stringify(err));
			// console.log(err);
			// console.log(err?.response?.data?.message);
		}
	};
	// const getMessage = async () => {
	// 	try {
	// 		const res = await axios.post(GAME_API + 'waiting_exit');
	// 		// console.log(res.data);
	// 		setMessage(res.data.message);
	// 	} catch (err) {
	// 		console.log(err);
	// 	}
	// };

	useEffect(() => {
		verifyDevice(user.user_token, () => {
			Alert.alert('Login Error', 'Your account has been logged out. Please log in again to continue.');
			dispatch(setLogout());
		});
		// getMessage();
		getGamePackages();
	}, []);
	return (
		<View style={s.modalBg}>
			{/* <Modal visible={visible} animationType='fade' onRequestClose={() => setVisible(false)} transparent style={{flex: 1}}>
				<View style={s.modalBg}>
					<View style={s.popUpBg}>
						<Text style={{color: '#000', fontSize: 16, textAlign: 'center'}}>{message}</Text>
					</View>
					<Button mode='contained' color='#FFD101' onPress={() => setVisible(false)} style={{alignSelf: 'center', marginTop: '5%'}}>
						Close
					</Button>
				</View>
			</Modal> */}
			<ImageBackground
				source={BG}
				style={s.popUpBg}
				imageStyle={{
					borderRadius: 20,
					borderColor: c.yellow,
					borderWidth: 2,
				}}>
				<Image source={Logo} style={s.menuTopImage} />
				<IconButton
					icon={'close'}
					color={'#000'}
					style={{
						backgroundColor: c.yellow,
						position: 'absolute',
						right: -20,
						top: -20,
					}}
					onPress={() => navigation.goBack()}
				/>
				<Text
					style={[
						s.bold,
						s.textCenter,
						s.textWhite,
						{
							fontSize: 18,
							paddingBottom: '3%',
							borderBottomWidth: 1,
							borderBottomColor: '#bbb',
							marginBottom: '3%',
						},
					]}>
					Choose an Option
				</Text>
				{loading ? (
					<ActivityIndicator size={'large'} color={c.yellow} />
				) : (
					<>
						<View style={[s.row, s.justifyAround]}>
							<Text style={[s.textWhite, s.bold, {fontSize: 15, flex: 2}]}>Wallet Type:</Text>
							<Dropdown
								data={[
									{
										label: 'Balance',
										value: 'F',
									},
									{
										label: 'E-Wallet',
										value: 'epin',
									},
								]}
								labelField="label"
								valueField="value"
								value={value}
								style={{backgroundColor: c.white, paddingHorizontal: '5%', marginHorizontal: '5%', flex: 3}}
								onChange={v => setValue(v.value)}
								selectedTextStyle={{color: '#000'}}
							/>
						</View>
						{/* <Picker style={{backgroundColor: c.yellow}} mode='dropdown' itemStyle={{backgroundColor: c.yellow, height: 20}}>
							<Picker.Item label='Balance' />
							<Picker.Item label='E-Wallet' />
						</Picker> */}
						<View style={[s.row, s.justifyAround, {flexWrap: 'wrap'}]}>
							{data.map((item, index) => (
								<TouchableOpacity
									key={index}
									activeOpacity={0.7}
									onPress={() => {
										// if (!disable.current) {
										handleChooseOption(item.id);
										// }
									}}
									style={s.packageGrid}>
									<View style={{marginHorizontal: '2%'}}>
										<View style={[s.row, s.justifyAround, {marginVertical: 5}]}>
											<Image
												source={Coin}
												style={{
													width: 20,
													height: 20,
													resizeMode: 'contain',
												}}
											/>
											<Text
												style={[
													s.textWhite,
													{
														fontSize: 18,
														fontFamily: 'DailyHours',
													},
												]}>
												WIN
											</Text>
										</View>
										<View
											style={{
												backgroundColor: '#015404',
												borderRadius: 20,
												paddingVertical: 2,
											}}>
											<Text
												style={[
													s.textCenter,
													s.textWhite,
													{
														fontSize: 18,
														fontFamily: 'DailyHours',
													},
												]}>
												{item.win_amount}
											</Text>
										</View>
									</View>
									<Text
										style={[
											s.textCenter,
											{
												color: '#000',
												fontFamily: 'DailyHours',
											},
										]}>
										Entry: {item.amount}
									</Text>
								</TouchableOpacity>
							))}
						</View>
					</>
				)}
			</ImageBackground>
		</View>
	);
}
