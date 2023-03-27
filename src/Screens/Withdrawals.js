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

export default function Withdrawals({navigation}) {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);

	const user = useSelector(selectUser);

	const getWithdrawals = async () => {
		try {
			setLoading(true);
			const res = await axios.post(api + 'mainWithdrawDetails', {
				user_token: user.user_token,
			});
			// console.log(res.data);
			if (res.data.status === 1) {
				setData([
					{
						user_name: 'Name',
						type: 'Method',
						value: 'Phone',
						status: 'Status',
						review: 'Review',
						amount: 'Amount',
						created_at: 'Request Date',
					},
					...res.data.summary,
				]);
			}
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
			<Text style={[s.textWhite, {width: 150, marginRight: 15, textTransform: 'capitalize'}]}>{item.user_name}</Text>
			<Text style={[s.textWhite, {width: 70, marginRight: 15, textTransform: 'capitalize'}]}>{item.type}</Text>
			<Text style={[s.textWhite, {width: 100, marginRight: 15}]}>{item.value}</Text>
			<Text style={[s.textWhite, {width: 100, marginRight: 15}]}>{index === 0 ? 'Status' : item.status === 1 ? 'Success' : item.status === 0 ? 'Pending' : 'Rejected'}</Text>
			<Text style={[s.textWhite, {width: 150, marginRight: 15}]}>{item.review ?? 'No Review'}</Text>
			<Text style={[s.textWhite, {width: 100, marginRight: 15}]}>{item.amount}</Text>
			<Text style={[s.textWhite, {width: 200}]}>
				{index === 0
					? 'Register Date'
					: new Date(item.created_at).toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit', hour12: false}) +
					  '  ' +
					  new Date(item.created_at).toLocaleDateString()}
			</Text>
		</View>
	);

	useFocusEffect(
		useCallback(() => {
			getWithdrawals();
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
					<Text style={[s.bold, s.textCenter, {fontSize: 18, color: c.yellow}]}>Withdrawals</Text>
					<Button
						mode='contained'
						color={c.green}
						labelStyle={{fontSize: 9}}
						onPress={() => navigation.navigate('Withdraw')}
						style={{alignSelf: 'flex-end', marginTop: '2%'}}>
						Withdraw Now
					</Button>
					{/* <View style={[s.shadow, { height: 1, backgroundColor: c.yellow, marginTop: '3%' }]}></View>
                    <View style={[s.row, s.justifyBetween, { width: '100%', paddingHorizontal: '5%' }]}>
                        <Text style={[s.textWhite, { width: '10%' }]}>Sr.</Text>
                        <Text style={[s.textWhite, { width: '25%' }]}>Method</Text>
                        <Text style={[s.textWhite, { width: '20%' }]}>Status</Text>
                        <Text style={[s.textWhite, { width: '20%' }]}>Amount</Text>
                        <Text style={[s.textWhite, { width: '25%' }]}>Time/Date</Text>
                    </View>
                    <View style={[s.shadow, { height: 1, backgroundColor: c.yellow }]}></View> */}
				</View>
				{loading ? (
					<ActivityIndicator color={c.yellow} size='large' style={{marginTop: '20%'}} />
				) : data.length > 0 ? (
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
