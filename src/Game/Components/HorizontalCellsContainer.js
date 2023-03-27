import React, {Component} from 'react';
import {Text, View} from 'react-native';
import {Constants} from '../Utils/positions';
import {getBackgroundColor} from '../Utils/util';
import CellBox from './CellBox';

export default class CellContainer extends Component {
	constructor(props) {
		super(props);
	}
	renderRow = row => {
		return (
			<View style={{flex: 1, flexDirection: 'row'}}>
				{row.map(position => (
					<CellBox key={position} position={position} bg={getBackgroundColor(position, this.props.game2)} />
				))}
			</View>
		);
	};
	render() {
		const position = this.props.positions;
		let row1, row2, row3;
		if (this.props.game2) {
			row1 = position === 'left' ? ['P39', 'P40', 'P41', 'P42', 'P43', 'P44'] : ['P6', 'P7', 'P8', 'P9', 'P10', 'P11'];
			row2 = position === 'left' ? ['P38', 'R1', 'R2', 'R3', 'R4', 'R5'] : ['Y5', 'Y4', 'Y3', 'Y2', 'Y1', 'P12'];
			row3 = position === 'left' ? ['P37', 'P36', 'P35', 'P34', 'P33', 'P32'] : ['P18', 'P17', 'P16', 'P15', 'P14', 'P13'];
		} else {
			row1 = position === 'left' ? ['P13', 'P14', 'P15', 'P16', 'P17', 'P18'] : ['P32', 'P33', 'P34', 'P35', 'P36', 'P37'];
			row2 = position === 'left' ? ['P12', 'R1', 'R2', 'R3', 'R4', 'R5'] : ['Y5', 'Y4', 'Y3', 'Y2', 'Y1', 'P38'];
			row3 = position === 'left' ? ['P11', 'P10', 'P9', 'P8', 'P7', 'P6'] : ['P44', 'P43', 'P42', 'P41', 'P40', 'P39'];
		}
		return (
			<View
				style={{
					position: 'absolute',
					width: 6 * Constants.CELL_SIZE,
					height: 3 * Constants.CELL_SIZE,
					left: position === 'left' ? 0 : Constants.CELL_SIZE * 9,
					top: Constants.CELL_SIZE * 6,
					flexDirection: 'column',
					overflow: 'hidden',
					padding: 5,
					zIndex: 0,
				}}>
				{this.renderRow(row1)}
				{this.renderRow(row2)}
				{this.renderRow(row3)}
			</View>
		);
	}
}
