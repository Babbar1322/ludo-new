import React, {useEffect, useState} from 'react';
import {View, Text, ImageBackground, FlatList, ActivityIndicator, Alert, ScrollView, TextInput, Keyboard} from 'react-native';
import Header from '../Components/Header';

import {api, c} from '../Config/Config';
import s from '../Config/Styles';

import BG from '../Assets/Images/GridBG.png';
import axios from 'axios';
import {useSelector} from 'react-redux';
import {selectUser} from '../Redux/Slices/AuthSlice';
import {useRef} from 'react';
import {Button} from 'react-native-paper';

export default function Directs({navigation}) {
	const [data, setData] = useState([
		{
			uid: 'User ID',
			name: 'Name',
			phone: 'Phone',
			is_active: 'Active',
			created_at: 'Register Date',
			activation_date: 'Activation Date',
		},
	]);
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const pageInput = useRef('');

	const user = useSelector(selectUser);

	const getDirects = async () => {
		try {
			setLoading(true);
			const res = await axios.post(api + 'userDirectDetails?page=' + page, {
				user_token: user.user_token,
			});
			// return // console.log(res.data);
			if (res.data.status === 0) {
				Alert.alert('Error', 'Something went wrong while fetching your Directs');
			}
			if (res.data.status === 1) {
				setData([
					{
						uid: 'User ID',
						name: 'Name',
						phone: 'Phone',
						is_active: 'Active',
						created_at: 'Register Date',
						activation_date: 'Activation Date',
					},
					...res.data.data.data,
				]);
				setTotalPages(res.data.data.last_page);
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
			<Text style={[s.textWhite, {width: 150, marginRight: 15}]}>{item.name}</Text>
			<Text style={[s.textWhite, {width: 100, marginRight: 15}]}>{item.uid}</Text>
			<Text style={[s.textWhite, {width: 150, marginRight: 15}]}>{item.phone}</Text>
			<Text style={[s.textWhite, {width: 50, marginRight: 15, color: index === 0 ? '#fff' : item.is_active === 0 ? 'red' : 'green'}]}>{index === 0 ? 'Active' : '■'}</Text>
			<Text style={[s.textWhite, {width: 200}]}>
				{index === 0
					? 'Register Date'
					: new Date(item.created_at).toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit', hour12: false}) +
					  '  ' +
					  new Date(item.created_at).toLocaleDateString()}
			</Text>
			<Text style={[s.textWhite, {width: 200}]}>
				{index === 0
					? 'Activation Date'
					: item.is_active === 0
					? 'Not Active'
					: new Date(item.activation_date ?? item.updated_at).toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit', hour12: false}) +
					  '  ' +
					  new Date(item.activation_date ?? item.updated_at).toLocaleDateString()}
			</Text>
		</View>
	);

	useEffect(() => {
		getDirects();
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
					<Text style={[s.bold, s.textCenter, {fontSize: 18, color: c.yellow}]}>Directs</Text>
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
