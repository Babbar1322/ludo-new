import React from 'react';
import {Image, TouchableOpacity, View} from 'react-native';

import Dice1 from '../Assets/Dice/dice1.png';
import Dice2 from '../Assets/Dice/dice2.png';
import Dice3 from '../Assets/Dice/dice3.png';
import Dice4 from '../Assets/Dice/dice4.png';
import Dice5 from '../Assets/Dice/dice5.png';
import Dice6 from '../Assets/Dice/dice6.png';
import RollingDice from '../Assets/Dice/Dice.gif';
import styles from '../Styles/styles';
import {c} from '../../Config/Config';
import {CountdownCircleTimer} from 'react-native-countdown-circle-timer';
import {BLUE} from '../Utils/constants';

export default function Dice({onDiceRoll, currentUser, isRolling, isWaitingForRollDice, timerRunning, timerKey, onComplete, turn, diceNumber}) {
	// console.log(isWaitingForRollDice, 'IS WAiting for dice roll');
	const renderDiceSurface = () => {
		switch (diceNumber) {
			case 1:
				return Dice1;
			case 2:
				return Dice2;
			case 3:
				return Dice3;
			case 4:
				return Dice4;
			case 5:
				return Dice5;
			case 6:
				return Dice6;
			default:
				return Dice1;
		}
	};

	// useEffect(() => {
	// 	// console.log(countdown, timerRunning);
	// 	// timerRef.current.reset();
	// 	setKey(prev => prev + 1);
	// }, [key]);
	return (
		<View style={{position: 'absolute', bottom: '10%'}}>
			<CountdownCircleTimer
				isPlaying={timerRunning}
				size={90}
				key={timerKey}
				onComplete={onComplete}
				strokeWidth={5}
				duration={59}
				colors={['#4ffa3c', '#faf03c', '#fa953c', '#fa3c3c']}
				colorsTime={[59, 40, 20, 0]}>
				{() => (
					<TouchableOpacity activeOpacity={0.7} style={styles.dice} disabled={turn !== currentUser} onPressIn={onDiceRoll}>
						{turn !== currentUser && (
							<View style={{position: 'absolute', backgroundColor: c.blue + 'aa', zIndex: 22, width: '100%', height: '100%', borderRadius: 300}} />
						)}
						<Image
							source={isRolling ? RollingDice : renderDiceSurface()}
							style={[
								{width: isRolling ? 100 : 40, height: isRolling ? 100 : 40, resizeMode: 'contain'},
								isWaitingForRollDice ? {borderColor: currentUser === BLUE ? '#0056C3' : '#0B762E', borderWidth: 3} : null,
							]}
						/>
					</TouchableOpacity>
				)}
			</CountdownCircleTimer>
		</View>
	);
}
