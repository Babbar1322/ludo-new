import React, {useEffect, useState} from 'react';
import {View, Text, ImageBackground, FlatList, ActivityIndicator, TextInput, Keyboard} from 'react-native';

import {api, c} from '../Config/Config';
import s from '../Config/Styles';

import BG from '../Assets/Images/GridBG.png';
import axios from 'axios';
import {useSelector} from 'react-redux';
import {selectUser} from '../Redux/Slices/AuthSlice';
import Header from '../Components/Header';
import {useRef} from 'react';
import {Button} from 'react-native-paper';

export default function LevelIncome({navigation}) {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const pageInput = useRef('');

	const user = useSelector(selectUser);

	const getLevelIncome = async () => {
		try {
			setLoading(true);
			const res = await axios.post(api + 'levelIncome?page=' + page, {
				user_token: user.user_token,
			});
			// console.log(res.data);
			setData(res.data.data.data);
			setTotalPages(res.data.data.last_page);
		} catch (err) {
			console.log(err);
		} finally {
			setLoading(false);
		}
	};

	const dataList = ({item, index}) => (
		<View style={[s.row, s.justifyBetween, {borderColor: c.yellow, borderWidth: 1, borderRadius: 10, marginBottom: '4%'}]} key={index}>
			<Text style={[s.textWhite, {width: '10%'}]}>{index + 1}</Text>
			<Text style={[s.textWhite, {width: '30%'}]}>{item.from_uid}</Text>
			<Text style={[s.textWhite, {width: '15%'}]}>{item.level}</Text>
			<Text style={[s.textWhite, {width: '20%'}]}>{item.amount}</Text>
			<Text style={[s.textWhite, {width: '25%'}]}>
				{new Date(item.created_at).toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit', hour12: false}) + ' ' + new Date(item.created_at).toLocaleDateString()}
			</Text>
		</View>
	);

	useEffect(() => {
		getLevelIncome();
	}, []);
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
					<Text style={[s.bold, s.textCenter, {fontSize: 18, color: c.yellow}]}>LEVEL INCOME</Text>
					{data.length > 0 && (
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
					<View style={[s.shadow, {height: 1, backgroundColor: c.yellow, marginTop: '3%'}]}></View>
					<View style={[s.row, s.justifyBetween, {width: '100%', paddingHorizontal: '5%'}]}>
						<Text style={[s.textWhite, {width: '10%'}]}>Sr.</Text>
						<Text style={[s.textWhite, {width: '30%'}]}>From</Text>
						<Text style={[s.textWhite, {width: '15%'}]}>Level</Text>
						<Text style={[s.textWhite, {width: '20%'}]}>Income</Text>
						<Text style={[s.textWhite, {width: '25%'}]}>Time/Date</Text>
					</View>
					<View style={[s.shadow, {height: 1, backgroundColor: c.yellow}]}></View>
				</View>
				{loading ? (
					<ActivityIndicator color={c.yellow} size='large' style={{marginTop: '20%'}} />
				) : data.length > 0 ? (
					<FlatList data={data} keyExtractor={(item, index) => index.id} renderItem={dataList} style={{width: '100%', paddingHorizontal: '1%', marginTop: '5%'}} />
				) : (
					<Text style={[s.textWhite, s.textCenter, s.bold, {fontSize: 20, marginTop: '20%'}]}>No Data Found!</Text>
				)}
			</ImageBackground>
		</View>
	);
}
