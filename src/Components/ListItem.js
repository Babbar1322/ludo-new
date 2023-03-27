import React from 'react';
import {Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import s from '../Config/Styles';
import {Icon} from 'react-native-elements';

export default function ListItem({title, onPress, loading, details, bg}) {
	return (
		<TouchableOpacity style={[s.profileMenuListItem, bg ? {backgroundColor: bg} : null]} activeOpacity={0.7} onPress={onPress}>
			<Text style={s.profileMenuListText}>
				{title}
				{details !== undefined && ':'} {loading ? <ActivityIndicator size='small' color='#000' /> : details}
			</Text>
			<Icon name='chevron-right' type='feather' />
		</TouchableOpacity>
	);
}
