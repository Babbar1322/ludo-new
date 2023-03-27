import {StatusBar, StyleSheet} from 'react-native';
import {SW} from '../Utils/constants';
import {Constants} from '../Utils/positions';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	board: {width: Constants.BOARD_SIZE, height: Constants.BOARD_SIZE, flex: null, borderRadius: 20, zIndex: 1},
	playerSection: {
		flex: 3,
		borderRadius: 25,
		flexDirection: 'row',
	},
	VerticalContainer: {
		flex: 3,
		flexDirection: 'row',
	},
	columnContaier: {
		flex: 1,
	},
	cellContainer: {
		flex: 1,
		borderRadius: 3,
		marginVertical: 1,
		backgroundColor: '#fff',
	},
	HorizontalContainer: {
		flex: 2,
	},
	rowContainer: {
		flex: 1,
		flexDirection: 'row',
	},
	innerContainer: {
		flex: 1,
		justifyContent: 'flex-end',
		borderRadius: 15,
		overflow: 'hidden',
	},
	piecesContainer: {
		flexDirection: 'row',
	},
	pieceStyle: {
		width: 13,
		height: 13,
		resizeMode: 'contain',
	},
	pieceBig: {
		width: '140%',
		height: '140%',
		resizeMode: 'contain',
		alignSelf: 'center',
		// bottom: '10%',
	},
	pieceBlue: {
		width: '140%',
		height: '140%',
		resizeMode: 'contain',
		alignSelf: 'flex-end',
	},
	pieceGreen: {
		width: '140%',
		height: '140%',
		resizeMode: 'contain',
		alignSelf: 'flex-start',
	},
	cellBoxContainer: {
		flex: 1,
		borderRadius: 3,
		borderLeftWidth: 1,
		borderRightWidth: 1,
		borderBottomWidth: 2,
		borderColor: '#00000055',
		shadowColor: '#ffffff',
		shadowOffset: {
			width: 0,
			height: 0,
		},
		shadowOpacity: 1,
		shadowRadius: 5,
		elevation: 3,
		backgroundColor: '#fff',
		// alignItems: 'center',
		justifyContent: 'flex-end',
	},
	dice: {
		// position: 'absolute',
		// bottom: '10%',
		// width: 70,
		height: '100%',
		// backgroundColor: '#fff',
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 60,
	},
	playerBoxContainer: {
		flex: 4,
		borderRadius: 15,
		overflow: 'hidden',
	},
	gradientContainer: {
		flex: 1,
		elevation: 4,
		borderRadius: 15,
		overflow: 'hidden',
	},
	nameContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: '3%',
		paddingVertical: '1%',
	},
	inGameAvatar: {
		width: SW / 5,
		height: SW / 5,
		resizeMode: 'contain',
		// bottom: 0,
		// position: 'absolute',
	},
	lottie: {
		position: 'absolute',
		top: 0,
		right: '5%',
		width: SW / 2,
		height: SW / 2,
		marginBottom: '4%',
	},
	buttonContainer: {
		paddingHorizontal: '4%',
		paddingVertical: '2%',
		borderRadius: 400,
		borderColor: '#fff',
		borderTopWidth: 0.3,
		borderWidth: 1.3,
		backgroundColor: '#ffffff22',
	},
	topRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		position: 'absolute',
		top: StatusBar.currentHeight + 15,
		width: '100%',
		paddingHorizontal: '4%',
	},
});

export default styles;
