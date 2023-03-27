import io from 'socket.io-client';
import {SOCKET_API} from '../Utils/constants';

const socket = io(SOCKET_API, {
	reconnection: true,
	reconnectionDelay: 2000,
	reconnectionAttempts: 20,
	reconnectionDelayMax: 5000,
	autoConnect: true,
});
socket.timeout = 2000;
socket.on('connect', data => {
	console.log('Socket Connected!');
});
socket.connect();

export default socket;