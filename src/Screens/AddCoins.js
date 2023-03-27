import React, { useState } from 'react';
import { View, Image, Alert, ToastAndroid, Modal } from 'react-native';
import { Button, IconButton, TextInput } from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';
import Clipboard from '@react-native-community/clipboard';
import ImagePicker from 'react-native-image-crop-picker';

import Logo from '../Assets/Images/Logo.png';
import { api, c } from '../Config/Config';
import s from '../Config/Styles';
import { useSelector } from 'react-redux';
import { selectUser } from '../Redux/Slices/AuthSlice';
import axios from 'axios';

export default function AddCoins({ navigation }) {
    const [visible, setVisible] = useState(false);
    const [image, setImage] = useState(null);

    const [uploading, setUploading] = useState(false);

    const user = useSelector(selectUser);

    const [amount, setAmount] = useState(0);
    const [transactionID, setTransactionID] = useState('');

    const handleImagePick = async () => {
        try {
            const result = await ImagePicker.openPicker({
                cropping: false,
                mediaType: 'photo'
            });
            // console.log(result);
            if (result.path) {
                setImage(result);
            }
        } catch (err) {
            console.log(err);
        }
    }

    const handleSubmit = async () => {
        try {
            setUploading(true);
            if (!amount) {
                Alert.alert('Warning', 'Please Enter a Valid Amount!');
                return false;
            }
            if (!transactionID) {
                Alert.alert('Warning', 'Please Enter a Valid Transaction ID!');
                return false;
            }
            if (!image) {
                Alert.alert('Warning', 'Please Choose a Screenshot to Upload!');
                return false;
            }
            const formData = new FormData();
            formData.append('user_token', user.user_token);
            formData.append('amount', amount);
            formData.append('transaction_id', transactionID);
            formData.append('image', {
                uri: image.path,
                name: image.path.replace(/^.*[\\\/]/, ''),
                type: image.mime
            });
            const res = await axios.post(api + 'payment', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            // console.log(res.data);
            if (res.status === 200) {
                Alert.alert('Success', 'Your Request is Submitted!\nWe Will Update Your Balance Shortly', [
                    {
                        text: 'Ok',
                        onPress: () => {
                            navigation.goBack();
                        },
                        style: 'cancel'
                    },
                ]);
            }
        } catch (err) {
            console.log(err);
            if (err.toString().endsWith('401')) {
                Alert.alert('Error', 'Transaction ID is Already Used!');
            }
        } finally {
            setUploading(false);
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#00000060' }}>
            <Modal visible={visible} transparent={true} onRequestClose={() => setVisible(false)} animationType='slide'>
                <View style={{ flex: 1, backgroundColor: '#000000bb', justifyContent: 'center', paddingHorizontal: '5%' }}>
                    <IconButton icon='close' style={{ backgroundColor: c.yellow, position: 'absolute', top: '10%', right: 0 }} color='#000' onPress={() => {
                        setVisible(false);
                        setImage(null);
                    }} />
                    <TextInput placeholder='Transaction ID' value={transactionID} onChangeText={e => setTransactionID(e)} activeUnderlineColor={c.yellow} style={{ height: 50 }} /*right={<TextInput.Icon icon='content-paste' onPress={() => setTransactionID(Clipboard.getString())} />} */ />
                    <TextInput placeholder='Amount' style={{ backgroundColor: c.white, marginTop: '5%', height: 50 }} keyboardType='number-pad' activeUnderlineColor={c.yellow} value={amount} onChangeText={e => setAmount(e)} />
                    {image &&
                        <View style={{ alignSelf: 'center', backgroundColor: c.white, padding: '2%', borderRadius: 10, marginTop: '5%' }}>
                            <Image source={{ uri: image.path }} style={{ height: 300, width: 150, resizeMode: 'contain' }} />
                        </View>}
                    <Button mode='contained' color={c.yellow} onPress={handleImagePick} style={{ marginTop: '5%' }}>{image ? 'Change' : 'Choose'} Screenshot</Button>
                    <Button mode='contained' color={c.yellow} loading={uploading} onPress={handleSubmit} style={{ marginTop: '5%' }}>Submit</Button>
                </View>
            </Modal>
            <View style={[s.justifyCenter, { flex: 1, paddingHorizontal: '5%' }]}>
                <View style={{ position: 'relative' }}>
                    <IconButton icon='close' color='#000' style={{ backgroundColor: c.yellow, position: 'absolute', top: '-7%', right: -10, zIndex: 2 }} onPress={() => navigation.goBack()} />
                    <View style={{ paddingHorizontal: '4%', paddingVertical: '7%', backgroundColor: '#000', borderRadius: 20, borderColor: c.yellow, borderWidth: 2 }}>
                        <View style={{ backgroundColor: c.white, padding: '3%', alignSelf: 'center', borderRadius: 10 }}>
                            <QRCode
                                value='upi://pay?pa=6280947932@ybl&pn=Ludo%20Network&cu=INR'
                                size={150} />
                        </View>
                        <TextInput value='6280947932@ybl' editable={false} style={{ backgroundColor: c.white, marginTop: '5%', height: 50 }} right={<TextInput.Icon icon='content-copy' onPress={() => {
                            Clipboard.setString('6280947932@ybl');
                            ToastAndroid.show('UPI ID Copied to Clipboard', 1000);
                        }} />} activeUnderlineColor={c.yellow} />
                        <Button mode='contained' color={c.yellow} style={{ marginTop: '5%' }} onPress={() => setVisible(true)}>Next</Button>
                    </View>
                </View>
            </View>
        </View>
    )
}