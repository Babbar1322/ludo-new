import {View, Text, Button} from 'react-native';
import React, {useEffect} from 'react';
import io from 'socket.io-client';
import {SOCKET_API} from '../Game/Utils/constants';

export default function SocketTest() {
	const socket = io(SOCKET_API);
	const roomId = Math.random().toString(36).substring(2, 10);
	useEffect(() => {
		socket.on('connect', () => {
			console.log('Socket connected');
			socket.emit('createRoom', roomId);
		});
		socket.on('test', data => {
			console.log(data);
		});
		socket.on('message', data => console.log(data));
		socket.on('roomsList', data => console.log(data));
		socket.connect();
	}, []);
	return (
		<View>
			<Text>SocketTest</Text>
			<Button title='Exit Room' onPress={() => socket.emit('exitRoom', roomId)} />
			<Button title='Leave All Rooms' onPress={() => socket.emit('clearAllRooms', roomId)} />
		</View>
	);
}
