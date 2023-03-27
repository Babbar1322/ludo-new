import axios from 'axios';
import {api} from './Config';
import {getUniqueId} from 'react-native-device-info';

export default async function verifyDevice(token, onError) {
	try {
		const deviceId = await getUniqueId();
		const res = await axios.post(api + 'verfiyDevice', {
			user_token: token,
			device_id: deviceId,
		});
		if (res.data.status === 0) {
			onError();
		}
		// console.log(res.data);
	} catch (err) {
		console.log(err);
	}
}
