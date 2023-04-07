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
P[1] = [CELL_SIZE * 7.7, CELL_SIZE * 0.65, 'P1']; //[CELL_SIZE * 5.95, CELL_SIZE * 12.5, 'P1'];
P[2] = [CELL_SIZE * 7.7, CELL_SIZE * 1.6, 'P2']; //[CELL_SIZE * 5.95, CELL_SIZE * 11.6, 'P2'];
P[3] = [CELL_SIZE * 7.7, CELL_SIZE * 2.5, 'P3']; //[CELL_SIZE * 5.95, CELL_SIZE * 10.7, 'P3'];
P[4] = [CELL_SIZE * 7.7, CELL_SIZE * 3.5, 'P4']; //[CELL_SIZE * 5.95, CELL_SIZE * 9.73, 'P4'];
P[5] = [CELL_SIZE * 7.7, CELL_SIZE * 4.45, 'P5']; //[CELL_SIZE * 5.95, CELL_SIZE * 8.75, 'P5'];
P[6] = [CELL_SIZE * 9, CELL_SIZE * 5.7, 'P6']; //[CELL_SIZE * 4.7, CELL_SIZE * 7.45, 'P6'];
P[7] = [CELL_SIZE * 9.93, CELL_SIZE * 5.7, 'P7']; //[CELL_SIZE * 3.75, CELL_SIZE * 7.45, 'P7'];
P[8] = [CELL_SIZE * 10.85, CELL_SIZE * 5.7, 'P8']; //[CELL_SIZE * 2.8, CELL_SIZE * 7.45, 'P8'];
P[9] = [CELL_SIZE * 11.8, CELL_SIZE * 5.7, 'P9']; //[CELL_SIZE * 1.9, CELL_SIZE * 7.45, 'P9'];
P[10] = [CELL_SIZE * 12.7, CELL_SIZE * 5.7, 'P10']; //[CELL_SIZE * 0.9, CELL_SIZE * 7.45, 'P10'];
P[11] = [CELL_SIZE * 13.65, CELL_SIZE * 5.7, 'P11']; //[0, CELL_SIZE * 7.45, 'P11'];
P[12] = [CELL_SIZE * 13.65, CELL_SIZE * 6.6, 'P12']; //[0, CELL_SIZE * 6.6, 'P12'];
P[13] = [CELL_SIZE * 13.65, CELL_SIZE * 7.45, 'P13']; //[0, CELL_SIZE * 5.7, 'P13'];
P[14] = [CELL_SIZE * 12.73, CELL_SIZE * 7.45, 'P14']; //[CELL_SIZE * 0.9, CELL_SIZE * 5.7, 'P14'];
P[15] = [CELL_SIZE * 11.8, CELL_SIZE * 7.45, 'P15']; //[CELL_SIZE * 1.9, CELL_SIZE * 5.7, 'P15'];
P[16] = [CELL_SIZE * 10.85, CELL_SIZE * 7.45, 'P16']; //[CELL_SIZE * 2.8, CELL_SIZE * 5.7, 'P16'];
P[17] = [CELL_SIZE * 9.93, CELL_SIZE * 7.45, 'P17']; //[CELL_SIZE * 3.75, CELL_SIZE * 5.7, 'P17'];
P[18] = [CELL_SIZE * 9, CELL_SIZE * 7.45, 'P18']; //[CELL_SIZE * 4.7, CELL_SIZE * 5.7, 'P18'];

P[19] = [CELL_SIZE * 7.7, CELL_SIZE * 8.75, 'P19']; //[CELL_SIZE * 5.95, CELL_SIZE * 4.45, 'P19'];
P[20] = [CELL_SIZE * 7.7, CELL_SIZE * 9.73, 'P20']; //[CELL_SIZE * 5.95, CELL_SIZE * 3.5, 'P20'];
P[21] = [CELL_SIZE * 7.7, CELL_SIZE * 10.63, 'P21']; //[CELL_SIZE * 5.95, CELL_SIZE * 2.5, 'P21'];
P[22] = [CELL_SIZE * 7.7, CELL_SIZE * 11.6, 'P22']; //[CELL_SIZE * 5.95, CELL_SIZE * 1.6, 'P22'];
P[23] = [CELL_SIZE * 7.7, CELL_SIZE * 12.5, 'P23']; //[CELL_SIZE * 5.95, CELL_SIZE * 0.65, 'P23'];
P[24] = [CELL_SIZE * 7.7, CELL_SIZE * 13.4, 'P24']; //[CELL_SIZE * 5.95, CELL_SIZE * -0.3, 'P24'];
P[25] = [CELL_SIZE * 6.84, CELL_SIZE * 13.4, 'P25']; //[CELL_SIZE * 6.84, CELL_SIZE * -0.3, 'P25'];
P[26] = [CELL_SIZE * 5.95, CELL_SIZE * 13.4, 'P26']; //[CELL_SIZE * 7.7, CELL_SIZE * -0.3, 'P26'];
P[27] = [CELL_SIZE * 5.95, CELL_SIZE * 12.5, 'P27']; //[CELL_SIZE * 7.7, CELL_SIZE * 0.65, 'P27'];
P[28] = [CELL_SIZE * 5.95, CELL_SIZE * 11.6, 'P28']; //[CELL_SIZE * 7.7, CELL_SIZE * 1.6, 'P28'];
P[29] = [CELL_SIZE * 5.95, CELL_SIZE * 10.7, 'P29']; //[CELL_SIZE * 7.7, CELL_SIZE * 2.5, 'P29'];
P[30] = [CELL_SIZE * 5.95, CELL_SIZE * 9.73, 'P30']; //[CELL_SIZE * 7.7, CELL_SIZE * 3.5, 'P30'];

P[31] = [CELL_SIZE * 5.95, CELL_SIZE * 8.75, 'P31']; //[CELL_SIZE * 7.7, CELL_SIZE * 4.45, 'P31'];
P[32] = [CELL_SIZE * 4.7, CELL_SIZE * 7.45, 'P32']; //[CELL_SIZE * 9, CELL_SIZE * 5.7, 'P32'];
P[33] = [CELL_SIZE * 3.75, CELL_SIZE * 7.45, 'P33']; //[CELL_SIZE * 9.93, CELL_SIZE * 5.7, 'P33'];
P[34] = [CELL_SIZE * 2.8, CELL_SIZE * 7.45, 'P34']; //[CELL_SIZE * 10.85, CELL_SIZE * 5.7, 'P34'];
P[35] = [CELL_SIZE * 1.9, CELL_SIZE * 7.45, 'P35']; //[CELL_SIZE * 11.8, CELL_SIZE * 5.7, 'P35'];
P[36] = [CELL_SIZE * 0.9, CELL_SIZE * 7.45, 'P36']; //[CELL_SIZE * 12.7, CELL_SIZE * 5.7, 'P36'];
P[37] = [0, CELL_SIZE * 7.45, 'P37']; //[CELL_SIZE * 13.65, CELL_SIZE * 5.7, 'P37'];
P[38] = [0, CELL_SIZE * 6.6, 'P38']; //[CELL_SIZE * 13.65, CELL_SIZE * 6.6, 'P38'];
P[39] = [0, CELL_SIZE * 5.7, 'P39']; //[CELL_SIZE * 13.65, CELL_SIZE * 7.45, 'P39'];
P[40] = [CELL_SIZE * 0.9, CELL_SIZE * 5.7, 'P40']; //[CELL_SIZE * 12.73, CELL_SIZE * 7.45, 'P40'];

P[41] = [CELL_SIZE * 1.9, CELL_SIZE * 5.7, 'P41']; //[CELL_SIZE * 11.8, CELL_SIZE * 7.45, 'P41'];
P[42] = [CELL_SIZE * 2.8, CELL_SIZE * 5.7, 'P42']; //[CELL_SIZE * 10.85, CELL_SIZE * 7.45, 'P42'];
P[43] = [CELL_SIZE * 3.75, CELL_SIZE * 5.7, 'P43']; //[CELL_SIZE * 9.93, CELL_SIZE * 7.45, 'P43'];
P[44] = [CELL_SIZE * 4.7, CELL_SIZE * 5.7, 'P44']; //[CELL_SIZE * 9, CELL_SIZE * 7.45, 'P44'];
P[45] = [CELL_SIZE * 5.95, CELL_SIZE * 4.45, 'P45']; //[CELL_SIZE * 7.7, CELL_SIZE * 8.75, 'P45'];
P[46] = [CELL_SIZE * 5.95, CELL_SIZE * 3.5, 'P46']; //[CELL_SIZE * 7.7, CELL_SIZE * 9.73, 'P46'];
P[47] = [CELL_SIZE * 5.95, CELL_SIZE * 2.5, 'P47']; //[CELL_SIZE * 7.7, CELL_SIZE * 10.63, 'P47'];
P[48] = [CELL_SIZE * 5.95, CELL_SIZE * 1.6, 'P48']; //[CELL_SIZE * 7.7, CELL_SIZE * 11.6, 'P48'];
P[49] = [CELL_SIZE * 5.95, CELL_SIZE * 0.65, 'P49']; //[CELL_SIZE * 7.7, CELL_SIZE * 12.5, 'P49'];
P[50] = [CELL_SIZE * 5.95, CELL_SIZE * -0.3, 'P50']; //[CELL_SIZE * 7.7, CELL_SIZE * 13.4, 'P50'];

P[51] = [CELL_SIZE * 6.84, CELL_SIZE * -0.3, 'P51']; //[CELL_SIZE * 6.84, CELL_SIZE * 13.4, 'P51'];
P[52] = [CELL_SIZE * 7.7, CELL_SIZE * -0.3, 'P52']; //[CELL_SIZE * 5.95, CELL_SIZE * 13.4, 'P52'];

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

export const B = [];
B[1] = [CELL_SIZE * 6.84, CELL_SIZE * 0.65, 'B1'];
B[2] = [CELL_SIZE * 6.84, CELL_SIZE * 1.6, 'B2'];
B[3] = [CELL_SIZE * 6.84, CELL_SIZE * 2.5, 'B3'];
B[4] = [CELL_SIZE * 6.84, CELL_SIZE * 3.5, 'B4'];
B[5] = [CELL_SIZE * 6.84, CELL_SIZE * 4.45, 'B5'];
B[6] = [CELL_SIZE * 6.84, CELL_SIZE * 5.45, 'B6'];

export const G = [];
G[1] = [CELL_SIZE * 6.84, CELL_SIZE * 12.5, 'G1'];
G[2] = [CELL_SIZE * 6.84, CELL_SIZE * 11.6, 'G2'];
G[3] = [CELL_SIZE * 6.84, CELL_SIZE * 10.63, 'G3'];
G[4] = [CELL_SIZE * 6.84, CELL_SIZE * 9.73, 'G4'];
G[5] = [CELL_SIZE * 6.84, CELL_SIZE * 8.75, 'G5'];
G[6] = [CELL_SIZE * 6.84, CELL_SIZE * 7.75, 'G6'];
