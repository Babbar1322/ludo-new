import React from 'react';
import {View, Text, Modal, ImageBackground, Image} from 'react-native';
import {Icon} from 'react-native-elements';
import {IconButton} from 'react-native-paper';

import BG from '../Assets/Images/GridBG.png';
import Logo from '../Assets/Images/Logo.png';
import {c} from '../Config/Config';
import s from '../Config/Styles';

export default function Popup({visible, onClose, children, closeButton, title, icon, color, bg}) {
	return (
		<Modal visible={visible} onRequestClose={onClose} transparent={true} animationType='slide'>
			<View style={bg ? [s.modalBg, {backgroundColor: bg + '55'}] : s.modalBg}>
				<ImageBackground source={BG} style={s.popUpBg} imageStyle={{borderRadius: 20, borderColor: c.yellow, borderWidth: 2}}>
					<Image source={Logo} style={s.menuTopImage} />
					{closeButton ? (
						<IconButton icon='close' color='#000' style={{backgroundColor: c.yellow, position: 'absolute', right: -20, top: -20}} onPress={onClose} />
					) : null}
					{icon && <Icon name={icon + '-circle'} type='feather' color={color} size={30} />}
					<Text
						style={[
							s.bold,
							s.textCenter,
							{color: color ?? '#000', fontSize: 18, paddingBottom: '3%', borderBottomWidth: 1, borderBottomColor: '#bbb', marginBottom: '3%'},
						]}>
						{title ?? 'Alert'}
					</Text>
					{children}
				</ImageBackground>
			</View>
		</Modal>
	);
}
