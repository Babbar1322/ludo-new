import {R1, P14, P22, P27, P35, P1, P9, P40, P48, R2, R3, R4, R5, G1, G2, G3, G4, G5, B1, B2, B3, B4, B5, Y1, Y2, Y3, Y4, Y5} from './constants';

const colors = {
	red: '#FF1723',
	green: '#23CE1E',
	blue: '#17B5FE',
	yellow: '#FFE20C',
};

export const getBackgroundColor = (position, game2) => {
	if (game2) {
		switch (position) {
			case P14:
			case P22:
			case Y1:
			case Y2:
			case Y3:
			case Y4:
			case Y5:
				return colors.yellow;
			case P27:
			case P35:
			case G1:
			case G2:
			case G3:
			case G4:
			case G5:
				return colors.green;
			case P1:
			case P9:
			case B1:
			case B2:
			case B3:
			case B4:
			case B5:
				return colors.blue;
			case P40:
			case P48:
			case R1:
			case R2:
			case R3:
			case R4:
			case R5:
				return colors.red;
			default:
				return '#fff';
		}
	} else {
		switch (position) {
			case P14:
			case P22:
			case R1:
			case R2:
			case R3:
			case R4:
			case R5:
				return colors.red;
			case P27:
			case P35:
			case G1:
			case G2:
			case G3:
			case G4:
			case G5:
				return colors.green;
			case P1:
			case P9:
			case B1:
			case B2:
			case B3:
			case B4:
			case B5:
				return colors.blue;
			case P40:
			case P48:
			case Y1:
			case Y2:
			case Y3:
			case Y4:
			case Y5:
				return colors.yellow;
			default:
				return '#fff';
		}
	}
};
