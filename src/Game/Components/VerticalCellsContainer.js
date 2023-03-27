import React, {Component} from 'react';
import {View} from 'react-native';
import {Constants} from '../Utils/positions';
import {getBackgroundColor} from '../Utils/util';
import CellBox from './CellBox';

export default class CellContainer extends Component {
	constructor(props) {
		super(props);
	}
	renderColumn = column => {
		return (
			<View style={{flex: 1}}>
				{column.map(position => (
					<CellBox key={position} position={position} bg={getBackgroundColor(position, this.props.game2)} />
				))}
			</View>
		);
	};
	render() {
		const position = this.props.positions;
		let column1, column2, column3;
		if (this.props.game2) {
			column1 = position === 'top' ? ['P50', 'P49', 'P48', 'P47', 'P46', 'P45'] : ['P31', 'P30', 'P29', 'P28', 'P27', 'P26'];
			column2 = position === 'top' ? ['P51', 'B1', 'B2', 'B3', 'B4', 'B5'] : ['G5', 'G4', 'G3', 'G2', 'G1', 'P25'];
			column3 = position === 'top' ? ['P52', 'P1', 'P2', 'P3', 'P4', 'P5'] : ['P19', 'P20', 'P21', 'P22', 'P23', 'P24'];
		} else {
			column1 = position === 'top' ? ['P24', 'P23', 'P22', 'P21', 'P20', 'P19'] : ['P5', 'P4', 'P3', 'P2', 'P1', 'P52'];
			column2 = position === 'top' ? ['P25', 'G1', 'G2', 'G3', 'G4', 'G5'] : ['B5', 'B4', 'B3', 'B2', 'B1', 'P51'];
			column3 = position === 'top' ? ['P26', 'P27', 'P28', 'P29', 'P30', 'P31'] : ['P45', 'P46', 'P47', 'P48', 'P49', 'P50'];
		}
		return (
			<View
				style={{
					position: 'absolute',
					width: 3 * Constants.CELL_SIZE,
					height: 6 * Constants.CELL_SIZE,
					left: Constants.CELL_SIZE * 6,
					top: position === 'top' ? 0 : Constants.CELL_SIZE * 9,
					flexDirection: 'row',
					overflow: 'hidden',
					padding: 5,
					zIndex: 0,
				}}>
				{this.renderColumn(column1)}
				{this.renderColumn(column2)}
				{this.renderColumn(column3)}
			</View>
		);
	}
}
