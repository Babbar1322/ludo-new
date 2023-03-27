import React, {useCallback, useState} from 'react';
import {View, Text, ImageBackground, FlatList, ActivityIndicator, ScrollView} from 'react-native';
import {Button} from 'react-native-paper';
import axios from 'axios';
import {useSelector} from 'react-redux';
import {selectUser} from '../Redux/Slices/AuthSlice';
import {useFocusEffect} from '@react-navigation/native';

import {api, c} from '../Config/Config';
import s from '../Config/Styles';

import BG from '../Assets/Images/GridBG.png';
import Header from '../Components/Header';

export default function ActivationHistory({navigation}) {
	const [data, setData] = useState([
		{
			uid: 'User ID',
			name: 'Name',
			is_active: 'Active',
			created_at: 'Register Date',
			activation_date: 'Activation Date',
		},
	]);
	const [loading, setLoading] = useState(false);

	const user = useSelector(selectUser);

	const getActivations = async () => {
		try {
			setLoading(true);
			const res = await axios.post(api + 'activationDetails', {
				user_token: user.user_token,
			});
			// return console.log(res.data.wallet);
			// if (res.data.status === 1) {
			const newData = res.data.wallet.map(item => {
				const date = new Date(item.created_at);
				const options = {hour: '2-digit', minute: '2-digit', hour12: true, year: 'numeric', month: '2-digit', day: '2-digit'};
				date.setHours(date.getHours() - 5);
				date.setMinutes(date.getMinutes() - 30);
				return {...item, created_at: date.toLocaleString('en-US', options)};
			});
			setData(prev => [...prev, ...newData]);
			// setData([
			// 	{
			// 		uid: 'User ID',
			// 		name: 'Name',
			// 		is_active: 'Active',
			// 		created_at: 'Register Date',
			// 		activation_date: 'Activation Date',
			// 	},
			// 	...res.data.wallet,
			// ]);
			// }
		} catch (err) {
			console.log(err);
		} finally {
			setLoading(false);
		}
	};

	const dataList = ({item, index}) => (
		<View
			style={
				index === 0
					? [s.row, s.justifyBetween, {borderTopWidth: 1, borderBottomWidth: 1, borderColor: c.yellow, marginBottom: 10}]
					: [s.row, s.justifyBetween, {borderColor: c.yellow, borderWidth: 1, borderRadius: 10, marginBottom: 5}]
			}>
			<Text style={[s.textWhite, {width: 50, marginRight: 15}]}>{index === 0 ? 'SR.' : index}</Text>
			<Text style={[s.textWhite, {width: 150, marginRight: 15}]}>{item.name ?? item.user.name}</Text>
			<Text style={[s.textWhite, {width: 100, marginRight: 15}]}>{item.uid ?? item.user.uid}</Text>
			{/* <Text style={[s.textWhite, { width: 150, marginRight: 15 }]}>{item.phone ?? item.user.phone}</Text> */}
			<Text style={[s.textWhite, {width: 100, marginRight: 15, color: c.white}]}>{index === 0 ? 'Status' : item.status === 1 ? 'Success' : 'Rejected'}</Text>
			<Text style={[s.textWhite, {width: 200}]}>
				{index === 0
					? 'Activation Date'
					: new Date(item.created_at).toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Kolkata'}) +
					  '  ' +
					  new Date(item.created_at).toLocaleDateString()}
			</Text>
		</View>
	);

	useFocusEffect(
		useCallback(() => {
			getActivations();
		}, [])
	);
	return (
		<View style={{flex: 1}}>
			<ImageBackground source={BG} style={{flex: 1}}>
				<Header
					goToHome={() => navigation.navigate('Home')}
					addCoins={() => navigation.navigate('AddCoins')}
					openMenu={() => navigation.navigate('MenuModal')}
					showBalance={true}
				/>
				<View style={{paddingTop: '10%'}}>
					{/* <View style={[s.row, s.justifyBetween]}> */}
					{/* <View style={{ width: '30%' }}></View> */}
					<Text style={[s.bold, s.textCenter, {fontSize: 18, color: c.yellow}]}>Activation History</Text>
					<Button
						mode='contained'
						color={c.green}
						labelStyle={{fontSize: 12}}
						onPress={() => navigation.navigate('Membership')}
						style={{alignSelf: 'flex-end', marginTop: '2%'}}>
						Activate Now
					</Button>
					{/* </View> */}
					{/* <View style={[s.shadow, { height: 1, backgroundColor: c.yellow, marginTop: '3%' }]}></View>
                    <View style={[s.row, s.justifyBetween, { width: '100%', paddingHorizontal: '5%' }]}>
                        <Text style={[s.textWhite, { width: '10%' }]}>Sr.</Text>
                        <Text style={[s.textWhite, { width: '25%' }]}>UserID</Text>
                        <Text style={[s.textWhite, { width: '20%' }]}>Status</Text>
                        <Text style={[s.textWhite, { width: '20%' }]}>Amount</Text>
                        <Text style={[s.textWhite, { width: '25%' }]}>Time/Date</Text>
                    </View>
                    <View style={[s.shadow, { height: 1, backgroundColor: c.yellow }]}></View> */}
				</View>
				{loading ? (
					<ActivityIndicator color={c.yellow} size='large' style={{marginTop: '20%'}} />
				) : data.length > 1 ? (
					<ScrollView horizontal>
						<FlatList
							data={data}
							// horizontal
							keyExtractor={(item, index) => index.id}
							renderItem={dataList}
							style={{paddingHorizontal: '1%', marginTop: '2%'}}
						/>
					</ScrollView>
				) : (
					<Text style={[s.textWhite, s.textCenter, s.bold, {fontSize: 20, marginTop: '20%'}]}>No Data Found!</Text>
				)}
			</ImageBackground>
		</View>
	);
}
