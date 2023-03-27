import React, { useState } from 'react';
import { View, Alert, ImageBackground } from 'react-native';
import { Button, IconButton, Text, TextInput } from 'react-native-paper';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import { Icon } from 'react-native-elements';

import BG from '../Assets/Images/GridBG.png';
import { api, c } from '../Config/Config';
import s from '../Config/Styles';
import { useSelector } from 'react-redux';
import { selectUser } from '../Redux/Slices/AuthSlice';

export default function Withdraw({ navigation }) {
    const [paymentOption, setPaymentOption] = useState('');
    const [uploading, setUploading] = useState(false);
    const user = useSelector(selectUser);
    const [amount, setAmount] = useState(0);
    const [phone, setPhone] = useState(0);
    const [responseMessage, setResponseMessage] = useState(null);

    const handleSubmit = async () => {
        try {
            setUploading(true);
            if (!amount || amount < 200) {
                Alert.alert('Warning', 'Please Enter a Valid Amount!');
                return false;
            }
            if (!phone) {
                Alert.alert('Warning', 'Please Enter a Phone or UPI ID!');
                return false;
            }
            if (!paymentOption) {
                Alert.alert('Warning', 'Please Choose a Payment Method!');
                return false;
            }
            const res = await axios.post(api + 'withdrawAmount', {
                user_token: user.user_token, amount, type: paymentOption, value: phone
            });
            // console.log(res.data);
            if (res.data.status === 1) {
                handleResponse('check-circle', 'green', res.data.message);
            }
            if (res.data.status === 0) {
                handleResponse('x-circle', 'red', res.data.message);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setUploading(false);
        }
    }

    const handleResponse = (icon, color, message) => {
        try {
            setResponseMessage({ icon, color, message });
            setTimeout(() => {
                setResponseMessage(null)
            }, 2000);
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <View style={s.modalBg}>
            <ImageBackground source={BG} style={s.popUpBg} imageStyle={{ borderRadius: 20, borderColor: c.yellow, borderWidth: 2 }} >
                <IconButton icon='close' color='#000' style={{ backgroundColor: c.yellow, position: 'absolute', right: -20, top: -20 }} onPress={() => navigation.goBack()} />
                <Text style={[s.bold, s.textCenter, s.textWhite, { fontSize: 18, marginBottom: '5%' }]}>Withdraw Request</Text>
                {responseMessage ?
                    <View style={{ justifyContent: 'center' }}>
                        <Icon name={responseMessage.icon} type='feather' color={responseMessage.color} size={80} />
                        <Text style={[s.bold, s.textCenter, { color: responseMessage.color }]}>{responseMessage.message}</Text>
                    </View> :
                    <View>
                        <Picker style={{ backgroundColor: c.white }} mode='dropdown' selectedValue={paymentOption} onValueChange={value => setPaymentOption(value)}>
                            <Picker.Item label='Select an Option' value='' />
                            <Picker.Item label='PayTM' value='paytm' />
                            <Picker.Item label='PhonePe' value='phonepe' />
                            <Picker.Item label='Google Pay' value='gpay' />
                            <Picker.Item label='UPI' value='upi' />
                        </Picker>
                        <TextInput placeholder='Enter Phone / UPI ID' style={{ backgroundColor: c.white, marginTop: '5%', height: 50 }} activeUnderlineColor={c.yellow} onChangeText={e => setPhone(e)} />
                        <Text style={[s.bold, s.textWhite, { marginTop: '5%' }]}>Minimum Withdrawal Amount is 200</Text>
                        <TextInput placeholder='Enter Amount' style={{ backgroundColor: c.white, height: 50 }} activeUnderlineColor={c.yellow} onChangeText={e => setAmount(e)} keyboardType='number-pad' />
                        <Button mode='contained' color={c.yellow} style={{ marginTop: '5%' }} loading={uploading} onPress={handleSubmit}>Submit</Button>
                    </View>
                }
            </ImageBackground>
        </View>
    )
}