import React from 'react';
import { Text, TouchableOpacity, ImageBackground, Image } from 'react-native';
import s from '../Config/Styles';
import ItemBG from '../Assets/Images/ItemBG.png';

export default function HomeGrid({ onPress, img, label }) {
    return (
        <TouchableOpacity style={s.homeGrid} activeOpacity={0.7} onPress={onPress}>
            <ImageBackground style={s.w_100} resizeMode='stretch' source={ItemBG}>
                <Image source={img} style={s.gridImg} />
                <Text style={TS.homeGrid}>{label}</Text>
            </ImageBackground>
        </TouchableOpacity>
    )
}