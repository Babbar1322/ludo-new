import React, {useCallback, useState} from 'react';
import {View, Text, ImageBackground, FlatList, ActivityIndicator, ScrollView, TouchableOpacity} from 'react-native';
import axios from 'axios';
import {useSelector} from 'react-redux';
import {selectUser} from '../Redux/Slices/AuthSlice';
import {useFocusEffect} from '@react-navigation/native';

import {api, c} from '../Config/Config';
import s from '../Config/Styles';

import BG from '../Assets/Images/GridBG.png';
import Header from '../Components/Header';

export default function GameRecords({navigation}) {
	const [data, setData] = useState([
		{
			description: 'Description',
			status: 'Status',
			amount: 'Amount',
			created_at: 'Register Date',
		},
	]);
	const [loading, setLoading] = useState(false);
	const [activeTab, setActiveTab] = useState(1);
	const user = useSelector(selectUser);

	const getWithdrawals = async () => {
		try {
			setLoading(true);
			// let
			const res = await axios.post(api + (activeTab === 1 ? 'gameWinDetails' : 'gameLoseDetails'), {
				user_token: user.user_token,
			});
			// console.log(res.data.data.data);
			if (res.data.status === 1) {
				const newData = res.data.data.data.map(item => {
					const date = new Date(item.created_at);
					const options = {hour: '2-digit', minute: '2-digit', hour12: true, year: 'numeric', month: '2-digit', day: '2-digit'};
					date.setHours(date.getHours() - 5);
					date.setMinutes(date.getMinutes() - 30);
					return {...item, created_at: date.toLocaleString('en-US', options)};
				});
				setData(prev => [...prev, ...newData]);
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
					? [s.row, s.justifyBetween, {borderTopWidth: 1, borderBottomWidth: 1, borderColor: c.yellow, marginBottom: 7}]
					: [s.row, s.justifyBetween, {borderColor: c.yellow, borderWidth: 1, borderRadius: 10, marginBottom: 3}]
			}>
			<Text style={[s.textWhite, {width: 50, marginRight: 15}]}>{index === 0 ? 'SR.' : index}</Text>
			<Text style={[s.textWhite, {width: 150, marginRight: 15}]}>{index === 0 ? 'Opponent User' : item.user?.name + '\n' + item.user?.uid}</Text>
			<Text style={[s.textWhite, {width: 150, marginRight: 15}]}>{item.description}</Text>
			<Text style={[s.textWhite, {width: 100, marginRight: 15}]}>{item.amount}</Text>
			<Text style={[s.textWhite, {width: 100, marginRight: 15}]}>{index === 0 ? 'Status' : item.status === 0 ? 'Credit' : 'Debit'}</Text>
			<Text style={[s.textWhite, {width: 200}]}>{item.created_at}</Text>
		</View>
	);

	useFocusEffect(
		useCallback(() => {
			getWithdrawals();

			return () => {
				setData([
					{
						description: 'Description',
						status: 'Status',
						amount: 'Amount',
						created_at: 'Register Date',
					},
				]);
			};
		}, [activeTab])
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
					<Text style={[s.bold, s.textCenter, {fontSize: 18, color: c.yellow}]}>Game Records</Text>
					<View style={[s.row, s.justifyAround, {backgroundColor: '#ddd', borderRadius: 100, marginHorizontal: '5%', marginTop: '2%'}]}>
						<TouchableOpacity
							onPress={() => setActiveTab(1)}
							style={{flex: 1, backgroundColor: activeTab === 1 ? c.yellow : null, borderRadius: 100, elevation: activeTab === 1 ? 10 : null, paddingVertical: '2%'}}>
							<Text style={[s.textCenter, s.bold, {color: '#000'}]}>Win Records</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => setActiveTab(2)}
							style={{flex: 1, backgroundColor: activeTab === 2 ? c.yellow : null, borderRadius: 100, elevation: activeTab === 2 ? 10 : null, paddingVertical: '2%'}}>
							<Text style={[s.textCenter, s.bold, {color: '#000'}]}>Loss Records</Text>
						</TouchableOpacity>
					</View>
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
