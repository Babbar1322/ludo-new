import React, { useCallback, useState } from 'react';
import { View, Text, ImageBackground, FlatList, ActivityIndicator, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Button } from 'react-native-paper';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { selectUser } from '../Redux/Slices/AuthSlice';
import { useFocusEffect } from '@react-navigation/native';

import { api, c } from '../Config/Config';
import s from '../Config/Styles';

import BG from '../Assets/Images/GridBG.png';
import Header from '../Components/Header';
import Popup from '../Components/Popup';

export default function AddCoinHistory({ navigation }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [popupData, setPopupData] = useState({});
    const user = useSelector(selectUser);

    const getWithdrawals = async () => {
        try {
            setLoading(true);
            const res = await axios.post(api + 'fundHistory', {
                user_token: user.user_token
            });
            // return console.log(res.data);
            // if (res.data.status === 1) {
            setData(res.data);
            // }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    const dataList = ({ item, index }) => (
        <TouchableOpacity key={index} activeOpacity={0.7} style={[s.row, s.justifyBetween, { borderColor: c.yellow, borderWidth: 1, borderRadius: 10, marginBottom: '4%' }]} onPress={() => {
            // console.log(item);
            setPopupData(item);
            setVisible(true);
        }}>
            <Text style={[s.textWhite, { width: '10%' }]}>{index + 1}</Text>
            <Text style={[s.textWhite, { width: '25%', textTransform: 'uppercase' }]}>{item.review ?? 'Null'}</Text>
            <Text style={[s.textWhite, { width: '20%' }]}>{item.status === 1 ? "Success" : item.status === 0 ? "Pending" : 'Rejected'}</Text>
            <Text style={[s.textWhite, { width: '20%' }]}>{item.amount}</Text>
            <Text style={[s.textWhite, { width: '25%' }]}>{new Date(item.created_at).toLocaleTimeString('en-US') + " " + new Date(item.created_at).toLocaleDateString()}</Text>
        </TouchableOpacity>
    )

    useFocusEffect(useCallback(() => {
        getWithdrawals();
    }, []))
    return (
        <View style={{ flex: 1 }}>
            <ImageBackground source={BG} style={{ flex: 1 }}>
                <Popup
                    closeButton
                    color={c.green}
                    onClose={() => setVisible(false)}
                    icon='help'
                    title='Info'
                    visible={visible}>
                    <ScrollView style={{ height: '60%' }}>
                        <Text style={[s.bold, s.textCenter, s.textWhite, { width: '100%', marginVertical: 1 }]}>User Name - {popupData.user_name}</Text>
                        <Text style={[s.bold, s.textCenter, s.textWhite, { width: '100%', marginVertical: 1 }]}>Amount - {popupData.amount}</Text>
                        <Text style={[s.bold, s.textCenter, s.textWhite, { width: '100%', marginVertical: 1 }]}>Transaction ID - {popupData.transaction_id}</Text>
                        <Text style={[s.bold, s.textCenter, s.textWhite, { width: '100%', marginVertical: 1 }]}>Review - {popupData.review ?? 'No Review'}</Text>
                        <Text style={[s.bold, s.textCenter, s.textWhite, { width: '100%', marginVertical: 1 }]}>Status - {popupData.status === 1 ? "Success" : popupData.status === 0 ? "Pending" : 'Rejected'}</Text>
                        <View style={{ alignSelf: 'center', backgroundColor: c.white, padding: '2%', borderRadius: 10, marginTop: '5%' }}>
                            <Image source={{ uri: 'https://ludonetwork.in/admin/transaction_slips/' + popupData.screen_shot }} style={{ height: 300, width: 150, resizeMode: 'contain' }} />
                        </View>
                    </ScrollView>
                </Popup>
                <Header goToHome={() => navigation.navigate('Home')}
                    addCoins={() => navigation.navigate('AddCoins')}
                    openMenu={() => navigation.navigate('MenuModal')}
                    showBalance={true} />
                <View style={{ paddingTop: '10%' }}>
                    <Text style={[s.bold, s.textCenter, { fontSize: 18, color: c.yellow }]}>Add Funds History</Text>
                    <Button mode='contained' color={c.green} labelStyle={{ fontSize: 9 }} onPress={() => navigation.navigate('AddCoins')} style={{ alignSelf: 'flex-end', marginTop: '2%' }}>Add Now</Button>
                    <View style={[s.shadow, { height: 1, backgroundColor: c.yellow, marginTop: '3%' }]}></View>
                    <View style={[s.row, s.justifyBetween, { width: '100%', paddingHorizontal: '5%' }]}>
                        <Text style={[s.textWhite, { width: '10%' }]}>Sr.</Text>
                        <Text style={[s.textWhite, { width: '25%' }]}>Review</Text>
                        <Text style={[s.textWhite, { width: '20%' }]}>Status</Text>
                        <Text style={[s.textWhite, { width: '20%' }]}>Amount</Text>
                        <Text style={[s.textWhite, { width: '25%' }]}>Time/Date</Text>
                    </View>
                    <View style={[s.shadow, { height: 1, backgroundColor: c.yellow }]}></View>
                </View>
                {loading ?
                    <ActivityIndicator color={c.yellow} size='large' style={{ marginTop: '20%' }} /> :
                    data.length > 0 ?
                        <FlatList
                            data={data}
                            keyExtractor={(item, index) => index.id}
                            renderItem={dataList}
                            style={{ width: '100%', paddingHorizontal: '1%', marginTop: '5%' }} />
                        : <Text style={[s.textWhite, s.textCenter, s.bold, { fontSize: 20, marginTop: '20%' }]}>No Data Found!</Text>
                }
            </ImageBackground>
        </View>
    )
}