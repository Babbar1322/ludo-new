import {Dimensions} from 'react-native';

const c = {
	green: '#9FE502',
	darkGreen: '#77ab02',
	yellow: '#FFD101',
	darkYellow: '#ab8c00',
	blue: '#03214E',
	white: '#ffffff',
};

const api = 'https://www.ludonetwork.in/admin/api/';
// const api = 'http://192.168.0.172:8000/api/';

const CurrentAppVersion = 'v5';

const SW = Math.round(Dimensions.get('screen').width);
const SH = Math.round(Dimensions.get('screen').height);

export {api, c, SW, SH, CurrentAppVersion};
