import React from 'react';
import { View, Image, TouchableOpacity, ImageBackground } from 'react-native';
import { IconButton, Text } from 'react-native-paper';

import Logo from '../Assets/Images/Logo.png';
import BG from '../Assets/Images/GridBG.png';
import { c } from '../Config/Config';
import s from '../Config/Styles';

export default function MenuModal({ navigation }) {
    return (
        <View style={s.modalBg}>
            <ImageBackground source={BG} style={s.popUpBg} imageStyle={{ borderRadius: 20, borderColor: c.yellow, borderWidth: 2 }} >
                <Image source={Logo} style={s.menuTopImage} />
                <IconButton icon='close' color='#000' style={{ backgroundColor: c.yellow, position: 'absolute', right: -20, top: -20 }} onPress={() => navigation.goBack()} />
                <TouchableOpacity style={s.menuListItem} activeOpacity={0.7}>
                    <Text style={s.menuListText}>Refer a Friend</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.menuListItem} activeOpacity={0.7}>
                    <Text style={s.menuListText}>Game Rules</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.menuListItem} activeOpacity={0.7}>
                    <Text style={s.menuListText}>Help & Support</Text>
                </TouchableOpacity>
            </ImageBackground>
        </View>
    )
}