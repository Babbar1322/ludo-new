import React, {useEffect, useRef, useState} from 'react';
import {View, Text, ImageBackground, FlatList, Alert, ActivityIndicator, ScrollView, TextInput, Keyboard} from 'react-native';

import {api, c} from '../Config/Config';
import s from '../Config/Styles';

import BG from '../Assets/Images/GridBG.png';
import axios from 'axios';
import {useSelector} from 'react-redux';
import {selectUser} from '../Redux/Slices/AuthSlice';
import Header from '../Components/Header';
import {Button} from 'react-native-paper';

export default function TransactionHistory({navigation}) {
	const [data, setData] = useState([]);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(0);
	// const [pageInput, setPageInput] = useState("")
	const pageInput = useRef('');
	const [loading, setLoading] = useState(false);

	const user = useSelector(selectUser);

	const getWalletSummary = async () => {
		try {
			setLoading(true);
			const res = await axios.post(api + 'walletSummary?page=' + page, {
				user_token: user.user_token,
				type: 'F',
			});
			// console.log(res.data);
			if (res.data.status === 0) {
				Alert.alert('Error', 'We got some error while fetching your Transaction History!');
			}
			if (res.data.status === 1) {
				setData([
					{
						description: 'Description',
						status: 'Status',
						amount: 'Amount',
						created_at: 'Date',
					},
					...res.data.summary.data,
				]);
				setTotalPages(res.data.summary.last_page);
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
			<Text style={[s.textWhite, {width: 150, marginRight: 15}]}>{item.description}</Text>
			<Text style={[s.textWhite, {width: 100, marginRight: 15}]}>{index === 0 ? 'Status' : item.status === 0 ? 'Credit' : 'Debit'}</Text>
			<Text style={[s.textWhite, {width: 100, marginRight: 15}]}>{item.amount}</Text>
			<Text style={[s.textWhite, {width: 200}]}>
				{index === 0
					? 'Date'
					: new Date(item.created_at).toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit', hour12: false}) +
					  '  ' +
					  new Date(item.created_at).toLocaleDateString()}
			</Text>
		</View>
	);

	useEffect(() => {
		getWalletSummary();
	}, [page]);
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
					<Text style={[s.bold, s.textCenter, {fontSize: 18, color: c.yellow}]}>Transaction History</Text>
					{data.length > 1 && (
						<>
							<View style={[s.row, s.justifyAround]}>
								<Text style={[s.bold, s.textCenter, s.textWhite]}>Current Page: {page}</Text>
								<Text style={[s.bold, s.textCenter, s.textWhite]}>Total Pages: {totalPages}</Text>
							</View>
							<View style={[s.row, s.justifyAround]}>
								<Button mode='contained' color={c.yellow} onPress={() => setPage(prev => (prev <= 1 ? 1 : prev - 1))} style={{flex: 1}}>
									Prev
								</Button>
								<TextInput
									placeholder='Go to Page'
									placeholderTextColor={'#ccc'}
									onChangeText={e => (pageInput.current = e)}
									style={{
										color: '#fff',
										borderColor: c.yellow,
										borderWidth: 1,
										borderRadius: 8,
										flex: 4,
										marginHorizontal: '5%',
										paddingHorizontal: '5%',
										height: 40,
									}}
									onSubmitEditing={() => {
										Keyboard.dismiss();
										if (pageInput.current > totalPages || pageInput.current < 1) {
											// setPage(pageInput.current)
											return;
										} else {
											setPage(pageInput.current);
										}
									}}
									keyboardType='numeric'
								/>
								<Button mode='contained' color={c.yellow} onPress={() => setPage(prev => (prev >= totalPages ? totalPages : parseInt(prev) + 1))} style={{flex: 1}}>
									Next
								</Button>
							</View>
						</>
					)}
				</View>
				{loading ? (
					<ActivityIndicator size='large' color={c.yellow} style={{marginTop: '20%'}} />
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
