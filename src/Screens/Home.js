import React, {useEffect, useState} from 'react';
import {View, ImageBackground, Image, TouchableOpacity, Modal, Share, ActivityIndicator, Linking, Alert, StatusBar, ToastAndroid} from 'react-native';
import {Button, IconButton, Text} from 'react-native-paper';

import BG from '../Assets/Images/GridBG.png';
import Logo from '../Assets/Images/Logo.png';
import ShareIcon from '../Assets/Images/Share.png';
import Help from '../Assets/Images/Help.png';
import Single from '../Assets/Images/Single.png';
import TwoPlayers from '../Assets/Images/TwoPlayers.png';
import FourPlayers from '../Assets/Images/FourPlayers.png';
import Private from '../Assets/Images/Private.png';
import Social from '../Assets/Images/Social.png';
import History from '../Assets/Images/History.png';
import Notice from '../Assets/Images/Notice.png';
import BtnBackground from '../Assets/Images/BtnBackground.png';
import TelegramIcon from '../Assets/Images/TelegramIcon.png';
import WhatsappIcon from '../Assets/Images/WhatsappIcon.png';
import ZoomIcon from '../Assets/Images/ZoomIcon.png';
import YoutubeIcon from '../Assets/Images/YoutubeIcon.png';
import InstaIcon from '../Assets/Images/InstaIcon.png';

import Avatar1 from '../Assets/Avatars/Avatar1.png';
import Avatar2 from '../Assets/Avatars/Avatar2.png';
import Avatar3 from '../Assets/Avatars/Avatar3.png';
import Avatar4 from '../Assets/Avatars/Avatar4.png';
import Avatar5 from '../Assets/Avatars/Avatar5.png';
import Avatar6 from '../Assets/Avatars/Avatar6.png';
import Avatar7 from '../Assets/Avatars/Avatar7.png';
import Avatar8 from '../Assets/Avatars/Avatar8.png';

import {api, c, SW} from '../Config/Config';
import s from '../Config/Styles';
import axios from 'axios';
import {useSelector} from 'react-redux';
import {selectUser} from '../Redux/Slices/AuthSlice';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import Popup from '../Components/Popup';
import TS from '../Config/TS';
import HomeGrid from '../Components/HomeGrid';
import {useFocusEffect} from '@react-navigation/native';
import BgMusic from '../Game/Components/BgMusic';
import {selectIsMusicPlaying} from '../Redux/Slices/GameSlice';

export default function Home({navigation}) {
	const user = useSelector(selectUser);
	const [whatsappLink, setWhatsappLink] = useState('');
	const [telegramLink, setTelegramLink] = useState('');
	const [youtubeLink, setYoutubeLink] = useState('');
	const [zoomLink, setZoomLink] = useState('');
	const [zoomTime, setZoomTime] = useState('');
	const [instaLink, setInstaLink] = useState('');
	const [loading, setLoading] = useState(false);
	const [visible, setVisible] = useState(false);
	const [avatarName, setAvatarName] = useState('');
	const [sliderImages, setSliderImages] = useState([]);
	const [sliderVisible, setSliderVisible] = useState(true);
	const isMusicPlaying = useSelector(selectIsMusicPlaying);

	const getLinks = async () => {
		try {
			setLoading(true);
			const res = await axios.post(api + 'socialLinks');
			// console.log(res.data);
			res.data.map(item => {
				switch (item.type) {
					case 'whatsapp': {
						setWhatsappLink(item.value);
						break;
					}
					case 'youtube': {
						setYoutubeLink(item.value);
						break;
					}
					case 'telegram': {
						setTelegramLink(item.value);
						break;
					}
					case 'zoom': {
						setZoomLink(item.value);
						break;
					}
					case 'zoom_start': {
						setZoomTime(item.value);
						break;
					}
					case 'banner': {
						setSliderImages([item.value]);
						break;
					}
					case 'banner1': {
						setSliderImages(state => [...state, item.value]);
						break;
					}
					case 'banner2': {
						setSliderImages(state => [...state, item.value]);
						break;
					}
					case 'insta': {
						setInstaLink(item.value);
						break;
					}
				}
			});
			// console.log(sliderImages);
		} catch (err) {
			console.log(err);
		} finally {
			setLoading(false);
		}
	};

	const handleAvatar = async () => {
		try {
			if (!avatarName) {
				Alert.alert('Alert', 'Please Choose an Image');
				return;
			}
			const res = await axios.post(api + 'updateImage', {
				user_token: user.user_token,
				image: avatarName,
				image_type: 'Avatar',
			});
			// console.log(res.data);
			if (res.data.status === 1) {
				setVisible(false);
			}
		} catch (err) {
			console.log(err);
		}
	};

	const getShareLink = async () => {
		try {
			setLoading(true);
			const res = await axios.post(api + 'link', {
				user_token: user.user_token,
			});
			// console.log(res.data);
			Share.share({
				message: res.data.message + '\n' + res.data.link + '\nRefferal ID - ' + res.data.uid,
			});
		} catch (err) {
			console.log(err);
		} finally {
			setLoading(false);
		}
	};

	const avatarSelect = avatar => {
		return (
			<TouchableOpacity activeOpacity={0.7} style={{marginBottom: '2%'}} onPress={() => setAvatarName(avatar)} key={avatar}>
				<Image source={avatar} style={[s.chooseAvatar, {borderWidth: avatarName === avatar ? 2 : 0}]} />
			</TouchableOpacity>
		);
	};

	useEffect(() => {
		if (!user.image_type) {
			setVisible(true);
		}
		getLinks();
	}, []);

	useFocusEffect(() => {
		// console.log(isMusicPlaying, 'plaaayyyyyinnnnng');
		if (isMusicPlaying === null) {
			BgMusic.play();
		}
	});

	return (
		<View style={{flex: 1}}>
			<StatusBar translucent={false} backgroundColor={c.blue} />
			<ImageBackground source={BG} style={{flex: 1}}>
				{sliderVisible && (
					<View style={s.slider}>
						<IconButton
							icon="close"
							style={s.closeBtn}
							onPress={() => {
								setSliderVisible(false);
							}}
						/>
						{/* <FlatList
                                data={sliderImages}
                                style={{ alignSelf: 'center', width: 350 }}
                                horizontal
                                ref={sliderRef}
                                onScrollToIndexFailed={info => {
                                    console.log(info);
                                    _stopAutoPlay();
                                    _startAutoPlay();
                                }}
                                pagingEnabled
                                showsHorizontalScrollIndicator={false}
                                renderItem={({ item }) => {
                                    return ( */}
						<View style={{position: 'relative'}}>
							<Image
								source={{
									uri: 'https://www.ludonetwork.in/admin/slider/' + sliderImages[0],
								}}
								style={s.sliderImage}
							/>
						</View>
						{/* )
                                }} /> */}
					</View>
				)}
				<Popup icon="check" title={'Welcome, ' + user.name} visible={visible} color={c.white} onClose={() => setVisible(false)}>
					<Text style={TS.WS}>Please Choose an Image for your avatar.</Text>
					<View style={[s.row, s.justifyAround, {flexWrap: 'wrap'}]}>
						{Array.from([Avatar1, Avatar2, Avatar3, Avatar4, Avatar5, Avatar6, Avatar7, Avatar8]).map(item => avatarSelect(item))}
					</View>
					<Button mode="contained" style={{marginVertical: '2%'}} color={c.green} onPress={handleAvatar}>
						Done
					</Button>
				</Popup>
				<Modal transparent visible={loading} animationType="fade">
					<View style={s.modalBg}>
						<ActivityIndicator size="large" color={c.green} />
					</View>
				</Modal>
				<Header
					openMenu={() => navigation.navigate('MenuModal')}
					profileMenu={() => navigation.navigate('ProfileMenu')}
					addCoins={() => navigation.navigate('AddCoinHistory')}
				/>

				<View style={{paddingHorizontal: '10%', position: 'relative'}}>
					<Image source={Logo} style={s.logo} />

					<View style={[s.row, s.justifyAround, {marginTop: '3%'}]}>
						<HomeGrid onPress={() => navigation.navigate('GameOptions')} img={TwoPlayers} label="2 Players" />
						<HomeGrid onPress={() => navigation.navigate('SocketTest')} img={Single} label="VS Computer" />
					</View>
					<View style={[s.row, s.justifyAround, {marginTop: '3%'}]}>
						<HomeGrid
							onPress={() =>
								navigation.navigate('Game', {player1: {id: 155, name: 'Gursahb', avatar: 'Avatar1'}, player2: {id: 282, name: 'Ludo', avatar: 'Avatar3'}})
							}
							img={FourPlayers}
							label="4 Players"
						/>
						<HomeGrid
							img={Private}
							label="Private"
							onPress={() =>
								navigation.navigate('Game2', {player1: {id: 155, name: 'Gursahb', avatar: 'Avatar1'}, player2: {id: 282, name: 'Ludo', avatar: 'Avatar3'}})
							}
						/>
					</View>
					<View style={[s.row, s.justifyBetween, {position: 'absolute', top: 0, left: 0, right: 0}]}>
						<View style={s.alignCenter}>
							<TouchableOpacity style={{marginBottom: '5%'}} activeOpacity={0.7}>
								<Image source={Social} style={s.smallIcon} />
								<Text style={TS.iconLabel}>Social</Text>
							</TouchableOpacity>
							<TouchableOpacity style={{marginBottom: '5%'}} onPress={getShareLink} activeOpacity={0.7}>
								<Image source={ShareIcon} style={s.smallIcon} />
								<Text style={TS.iconLabel}>Refer</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={{marginBottom: '5%'}}
								activeOpacity={0.7}
								onPress={() =>
									Linking.openURL(
										'https://wa.me/917973577833?text=' + encodeURI('Name - ' + user.name + '\nUserID - ' + user.uid + '\nFrom Ludo Network Support')
									)
								}>
								<Image source={Help} style={s.smallIcon} />
								<Text style={TS.iconLabel}>Support</Text>
							</TouchableOpacity>
						</View>
						<View style={s.alignCenter}>
							<TouchableOpacity style={{marginBottom: '5%'}} activeOpacity={0.7} onPress={() => navigation.navigate('TransactionHistory')}>
								<Image source={History} style={s.smallIcon} />
								<Text style={TS.iconLabel}>Transaction{'\n'}History</Text>
							</TouchableOpacity>
							<TouchableOpacity style={{marginBottom: '5%'}} activeOpacity={0.7}>
								<Image source={Notice} style={s.smallIcon} />
								<Text style={TS.iconLabel}>Notice</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
				<TouchableOpacity style={{alignSelf: 'center'}} activeOpacity={0.7} onPress={() => Linking.openURL(zoomLink)}>
					<ImageBackground source={BtnBackground} style={[s.row, {width: SW / 1.8, height: SW / 6, marginTop: '3%'}]} resizeMode="stretch">
						<Image source={ZoomIcon} style={s.iconImage} />
						<View>
							<Text style={TS.homeGrid}>Zoom Meet</Text>
							<Text style={TS.zoomTime}>{zoomTime}</Text>
						</View>
					</ImageBackground>
				</TouchableOpacity>
				<View
					style={{
						position: 'absolute',
						alignSelf: 'flex-end',
						right: '3%',
						bottom: '12%',
					}}>
					<TouchableOpacity activeOpacity={0.7} style={{marginBottom: 20}} onPress={() => Linking.openURL(instaLink)}>
						<Image source={InstaIcon} style={s.smallIcon} />
					</TouchableOpacity>
					<TouchableOpacity activeOpacity={0.7} style={{marginBottom: 20}} onPress={() => Linking.openURL(whatsappLink)}>
						<Image source={WhatsappIcon} style={s.smallIcon} />
					</TouchableOpacity>
					<TouchableOpacity activeOpacity={0.7} style={{marginBottom: 20}} onPress={() => Linking.openURL(youtubeLink)}>
						<Image source={YoutubeIcon} style={s.smallIcon} />
					</TouchableOpacity>
					<TouchableOpacity activeOpacity={0.7} style={{marginBottom: 20}} onPress={() => Linking.openURL(telegramLink)}>
						<Image source={TelegramIcon} style={s.smallIcon} />
					</TouchableOpacity>
				</View>
				<Footer withdraw={() => navigation.navigate('Blue')} settings={() => navigation.navigate('Settings')} leaderBord={() => navigation.navigate('ActivationHistory')} />
			</ImageBackground>
		</View>
	);
}
