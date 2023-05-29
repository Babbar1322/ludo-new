import React, {useEffect, useRef} from 'react';
import {Text, TouchableOpacity, ImageBackground, Image, Animated} from 'react-native';
import s from '../Config/Styles';
import ItemBG from '../Assets/Images/ItemBG.png';
import TS from '../Config/TS';

export default function HomeGrid({onPress, img, label}) {
	const animatedValue = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		Animated.loop(
			Animated.sequence([
				Animated.timing(animatedValue, {
					toValue: 1,
					duration: 100,
					useNativeDriver: true,
				}),
				Animated.timing(animatedValue, {
					toValue: 0,
					duration: 100,
					useNativeDriver: true,
				}),
			]),
			{iterations: -1},
			{useNativeDriver: true}
		).start();
	}, [animatedValue]);

	const rotateInterpolate = animatedValue.interpolate({
		inputRange: [0, 1],
		outputRange: ['-3deg', '3deg'],
	});
	return (
		<TouchableOpacity style={s.homeGrid} activeOpacity={0.7} onPress={onPress}>
			<Animated.View style={{transform: [{rotate: rotateInterpolate}]}}>
				<ImageBackground style={s.w_100} resizeMode="stretch" source={ItemBG}>
					<Image source={img} style={s.gridImg} />
					<Text style={TS.homeGrid}>{label}</Text>
				</ImageBackground>
			</Animated.View>
		</TouchableOpacity>
	);
}
