import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';

import { c } from '../Config/Config';
import s from '../Config/Styles';

import LeaderboardIcon from '../Assets/Images/LeaderBoard.png';
import Settings from '../Assets/Images/Settings.png';
import Wallet from '../Assets/Images/Wallet.png';
import TS from '../Config/TS';

export default function Footer({ leaderBord, settings, withdraw }) {
    return (
        <View style={[s.row, s.justifyAround, { position: 'absolute', bottom: 0, left: 0, right: 0, borderTopColor: c.yellow, borderTopWidth: 1 }]}>
            <TouchableOpacity style={s.alignCenter} activeOpacity={0.7} onPress={leaderBord}>
                <Image source={LeaderboardIcon} style={s.smallIcon} />
                <Text style={TS.iconLabel}>Activation</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.alignCenter} activeOpacity={0.7} onPress={settings}>
                <Image source={Settings} style={s.smallIcon} />
                <Text style={TS.iconLabel}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.alignCenter} activeOpacity={0.7} onPress={withdraw}>
                <Image source={Wallet} style={s.smallIcon} />
                <Text style={TS.iconLabel}>Withdrawal</Text>
            </TouchableOpacity>
        </View>
    )
}