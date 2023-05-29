import {Dimensions} from 'react-native';

// import { Constants } from './Constanst';
export const Constants = {
	MAX_WIDTH: Dimensions.get('screen').width,
	MAX_HEIGHT: Dimensions.get('screen').height,
	GRID_SIZE: 15,
	CELL_SIZE: Dimensions.get('screen').width / 15,
	BOARD_SIZE: Dimensions.get('screen').width,
};
const {CELL_SIZE} = Constants;

export const P = [];
P[1] = [CELL_SIZE * 6.01, CELL_SIZE * 12.6, 'P1'];
P[2] = [CELL_SIZE * 6.01, CELL_SIZE * 11.7, 'P2'];
P[3] = [CELL_SIZE * 6.01, CELL_SIZE * 10.75, 'P3'];
P[4] = [CELL_SIZE * 6.01, CELL_SIZE * 9.8, 'P4'];
P[5] = [CELL_SIZE * 6.01, CELL_SIZE * 8.85, 'P5'];
P[6] = [CELL_SIZE * 4.76, CELL_SIZE * 7.56, 'P6'];
P[7] = [CELL_SIZE * 3.85, CELL_SIZE * 7.56, 'P7'];
P[8] = [CELL_SIZE * 2.9, CELL_SIZE * 7.56, 'P8'];
P[9] = [CELL_SIZE * 1.95, CELL_SIZE * 7.56, 'P9'];
P[10] = [CELL_SIZE * 1, CELL_SIZE * 7.56, 'P10'];
P[11] = [CELL_SIZE * 0.1, CELL_SIZE * 7.56, 'P11'];
P[12] = [CELL_SIZE * 0.1, CELL_SIZE * 6.7, 'P12'];
P[13] = [CELL_SIZE * 0.1, CELL_SIZE * 5.8, 'P13'];
P[14] = [CELL_SIZE * 1, CELL_SIZE * 5.8, 'P14'];
P[15] = [CELL_SIZE * 1.95, CELL_SIZE * 5.8, 'P15'];
P[16] = [CELL_SIZE * 2.89, CELL_SIZE * 5.8, 'P16'];
P[17] = [CELL_SIZE * 3.83, CELL_SIZE * 5.8, 'P17'];
P[18] = [CELL_SIZE * 4.76, CELL_SIZE * 5.8, 'P18'];

P[19] = [CELL_SIZE * 6.05, CELL_SIZE * 4.55, 'P19'];
P[20] = [CELL_SIZE * 6.05, CELL_SIZE * 3.6, 'P20'];
P[21] = [CELL_SIZE * 6.05, CELL_SIZE * 2.66, 'P21'];
P[22] = [CELL_SIZE * 6.05, CELL_SIZE * 1.74, 'P22'];
P[23] = [CELL_SIZE * 6.05, CELL_SIZE * 0.8, 'P23'];
P[24] = [CELL_SIZE * 6.05, CELL_SIZE * -0.17, 'P24'];
P[25] = [CELL_SIZE * 6.92, CELL_SIZE * -0.17, 'P25'];
P[26] = [CELL_SIZE * 7.8, CELL_SIZE * -0.17, 'P26'];
P[27] = [CELL_SIZE * 7.8, CELL_SIZE * 0.75, 'P27'];
P[28] = [CELL_SIZE * 7.8, CELL_SIZE * 1.7, 'P28'];
P[29] = [CELL_SIZE * 7.8, CELL_SIZE * 2.65, 'P29'];
P[30] = [CELL_SIZE * 7.8, CELL_SIZE * 3.6, 'P30'];

P[31] = [CELL_SIZE * 7.8, CELL_SIZE * 4.57, 'P31'];
P[32] = [CELL_SIZE * 9.06, CELL_SIZE * 5.8, 'P32'];
P[33] = [CELL_SIZE * 10, CELL_SIZE * 5.8, 'P33'];
P[34] = [CELL_SIZE * 10.95, CELL_SIZE * 5.8, 'P34'];
P[35] = [CELL_SIZE * 11.9, CELL_SIZE * 5.8, 'P35'];
P[36] = [CELL_SIZE * 12.8, CELL_SIZE * 5.8, 'P36'];
P[37] = [CELL_SIZE * 13.78, CELL_SIZE * 5.8, 'P37'];
P[38] = [CELL_SIZE * 13.78, CELL_SIZE * 6.65, 'P38'];
P[39] = [CELL_SIZE * 13.78, CELL_SIZE * 7.56, 'P39'];
P[40] = [CELL_SIZE * 12.8, CELL_SIZE * 7.56, 'P40'];

P[41] = [CELL_SIZE * 11.9, CELL_SIZE * 7.56, 'P41'];
P[42] = [CELL_SIZE * 10.95, CELL_SIZE * 7.56, 'P42'];
P[43] = [CELL_SIZE * 10, CELL_SIZE * 7.56, 'P43'];
P[44] = [CELL_SIZE * 9.07, CELL_SIZE * 7.56, 'P44'];
P[45] = [CELL_SIZE * 7.8, CELL_SIZE * 8.85, 'P45'];
P[46] = [CELL_SIZE * 7.8, CELL_SIZE * 9.8, 'P46'];
P[47] = [CELL_SIZE * 7.8, CELL_SIZE * 10.7, 'P47'];
P[48] = [CELL_SIZE * 7.8, CELL_SIZE * 11.66, 'P48'];
P[49] = [CELL_SIZE * 7.8, CELL_SIZE * 12.6, 'P49'];
P[50] = [CELL_SIZE * 7.8, CELL_SIZE * 13.5, 'P50'];

P[51] = [CELL_SIZE * 6.9, CELL_SIZE * 13.5, 'P51'];
P[52] = [CELL_SIZE * 6.05, CELL_SIZE * 13.5, 'P52'];

export const R1 = 'R1';
export const R2 = 'R2';
export const R3 = 'R3';
export const R4 = 'R4';
export const R5 = 'R5';

export const Y1 = 'Y1';
export const Y2 = 'Y2';
export const Y3 = 'Y3';
export const Y4 = 'Y4';
export const Y5 = 'Y5';

export const G = [];
G[1] = [CELL_SIZE * 6.91, CELL_SIZE * 0.75, 'G1'];
G[2] = [CELL_SIZE * 6.91, CELL_SIZE * 1.7, 'G2'];
G[3] = [CELL_SIZE * 6.91, CELL_SIZE * 2.63, 'G3'];
G[4] = [CELL_SIZE * 6.91, CELL_SIZE * 3.6, 'G4'];
G[5] = [CELL_SIZE * 6.91, CELL_SIZE * 4.55, 'G5'];
G[6] = [CELL_SIZE * 6.91, CELL_SIZE * 5.8, 'G6'];

export const B = [];
B[1] = [CELL_SIZE * 6.91, CELL_SIZE * 12.58, 'B1'];
B[2] = [CELL_SIZE * 6.91, CELL_SIZE * 11.65, 'B2'];
B[3] = [CELL_SIZE * 6.91, CELL_SIZE * 10.68, 'B3'];
B[4] = [CELL_SIZE * 6.91, CELL_SIZE * 9.79, 'B4'];
B[5] = [CELL_SIZE * 6.91, CELL_SIZE * 8.83, 'B5'];
B[6] = [CELL_SIZE * 6.91, CELL_SIZE * 7.75, 'B6'];
