import React from 'react';
import {View} from 'react-native';
import {Icon} from 'react-native-elements';

export default function CellBox({bg, position}) {
	return (
		<View style={{flex: 1, backgroundColor: bg, margin: 1, borderRadius: 5}}>
			{(position === 'P48' || position === 'P9' || position === 'P22' || position === 'P35') && (
				<Icon color='#000' containerStyle={{flex: 1, alignItems: 'center', justifyContent: 'center'}} name='staro' type='ant-design' />
			)}
		</View>
	);
}
