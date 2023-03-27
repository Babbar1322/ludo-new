import React, {useState} from 'react';
import {View, Image, ImageBackground, Text, TouchableOpacity} from 'react-native';
import { IconButton} from 'react-native-paper';

import Logo from '../Assets/Images/Logo.png';
import BG from '../Assets/Images/GridBG.png';
import {c} from '../Config/Config';
import s from '../Config/Styles';
import BgMusic from '../Game/Components/BgMusic';
import musicOn from '../Assets/Images/musicOn.png';
import musicOff from '../Assets/Images/musicOff.png';
import { useDispatch } from 'react-redux';
import {  setMusic } from '../Redux/Slices/GameSlice';

export default function Settings({navigation}) {
    const [isMusicPlaying, setIsMusicPlaying] = useState(BgMusic.isPlaying());
    const dispatch = useDispatch();
	return (
		<View style={s.modalBg}>
			<ImageBackground source={BG} style={s.popUpBg} imageStyle={{borderRadius: 20, borderColor: c.yellow, borderWidth: 2}}>
				<Image source={Logo} style={s.menuTopImage} />
				<IconButton icon='close' color='#000' style={{backgroundColor: c.yellow, position: 'absolute', right: -20, top: -20}} onPress={() => navigation.goBack()} />
                <View>
                    <Text style={[s.bold, s.textWhite, s.textCenter, {fontSize: 16, marginVertical: '5%'}]}>Settings</Text>
                    <View style={[s.row, s.justifyAround]}>
                        <Text style={[s.bold, s.textWhite, {fontSize: 16}]}>Music</Text>
                        <TouchableOpacity onPress={() => {
                            if(isMusicPlaying){
                                setIsMusicPlaying(false);
                                BgMusic.pause();
                                dispatch(setMusic(false));
                            } else {
                                setIsMusicPlaying(true);
                                BgMusic.play();
                                dispatch(setMusic(true));
                            }
                        }}>
                            <Image source={isMusicPlaying ? musicOn : musicOff} style={{width: 30, height: 30, resizeMode: 'contain'}} />
                        </TouchableOpacity>
                    </View>
                </View>
			</ImageBackground>
		</View>
	);
}
