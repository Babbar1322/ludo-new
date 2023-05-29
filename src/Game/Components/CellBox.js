import React from 'react';
import {View} from 'react-native';
import {Icon} from 'react-native-elements';

export default function CellBox({bg, position}) {
	return (
		<View style={{flex: 1, backgroundColor: bg, margin: 1, borderRadius: 5, alignItems: 'center', justifyContent: 'center'}}>
			{(position === 'P48' ||
				position === 'P9' ||
				position === 'P22' ||
				position === 'P35' ||
				position === 'P1' ||
				position === 'P27' ||
				position === 'P14' ||
				position === 'P40') && (
				<Icon
					containerStyle={{flex: 1, alignItems: 'center', justifyContent: 'center', position: 'absolute'}}
					iconStyle={{alignSelf: 'center', objectFit: 'contain', width: '100%', height: '100%'}}
					name="staro"
					type="ant-design"
				/>
			)}
		</View>
	);
}
