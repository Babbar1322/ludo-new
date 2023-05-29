import React, {Component} from 'react';
import {ImageBackground, Text, View} from 'react-native';
import Player from './Player';
import VerticalCellContainer from './VerticalCellsContainer';
import HorizontalCellContainer from './HorizontalCellsContainer';
import Center from './Center';
import Piece from './Piece';
import {B, G, P, Constants} from '../Utils/positions2';
import styles from '../Styles/styles';

export default class GameBoard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			pieces: [
				{
					position: P[27],
					size: Constants.CELL_SIZE - 5,
					color: 'green',
					animateForSelection: false,
					name: 1,
				},
				{
					position: P[27],
					size: Constants.CELL_SIZE - 5,
					color: 'green',
					name: 2,
				},
				{
					position: P[27],
					size: Constants.CELL_SIZE - 5,
					color: 'green',
					name: 3,
				},
				{
					position: P[27],
					size: Constants.CELL_SIZE - 5,
					color: 'green',
					name: 4,
				},
				// {
				// 	position: [Constants.CELL_SIZE * 8, Constants.CELL_SIZE * 1],
				// 	size: Constants.CELL_SIZE,
				// 	color: 'green',
				// 	name: 'one',
				// },
				// {
				// 	position: [Constants.CELL_SIZE * 8, Constants.CELL_SIZE * 1],
				// 	size: Constants.CELL_SIZE,
				// 	color: 'green',
				// 	name: 'two',
				// },
				// {
				// 	position: [Constants.CELL_SIZE * 8, Constants.CELL_SIZE * 1],
				// 	size: Constants.CELL_SIZE,
				// 	color: 'green',
				// 	name: 'three',
				// },
				// {
				// 	position: [Constants.CELL_SIZE * 8, Constants.CELL_SIZE * 1],
				// 	size: Constants.CELL_SIZE,
				// 	color: 'green',
				// 	name: 'four',
				// },
			],
		};
		this.boardSize = Constants.CELL_SIZE * Constants.GRID_SIZE;
		this.onPieceTouch = this.onPieceTouch.bind(this);
	}
	// shouldComponentUpdate(nextProps) {
	// 	// Only update if the score prop has changed
	// 	return nextProps !== this.props;
	// }
	// componentDidMount() {
	// 	this.setState((prevState) => ({
	// 		pieces: prevState.pieces.map((p) => {
	// 			if (p.name === 'one' && p.color === 'blue') {
	// 				return { ...p, position: G[5] };
	// 			}
	// 			return p;
	// 		}),
	// 	}));
	// }

	async onPieceTouch(piece, prevPosition, newPostion) {
		// console.log('Helklo');
		// this.setState((prevState) => ({
		// 	pieces: prevState.pieces.map((p) => {
		// 		if (p.name === piece.name && p.color === piece.color) {
		// 			return { ...p, position: P[35] };
		// 		}
		// 		return p;
		// 	}),
		// }));

		for (let i = prevPosition; i <= newPostion; i++) {
			if (i > prevPosition) {
				await new Promise(resolve => {
					setTimeout(() => {
						resolve(
							this.setState(prevState => ({
								pieces: prevState.pieces.map(p => {
									if (p.name === piece.name && p.color === piece.color) {
										return {...p, position: P[i]};
									}
									return p;
								}),
							}))
						);
					}, 60);
				});
			} else {
				this.setState(prevState => ({
					pieces: prevState.pieces.map(p => {
						if (p.name === piece.name && p.color === piece.color) {
							return {...p, position: P[i]};
						}
						return p;
					}),
				}));
			}
		}
	}
	render() {
		return (
			<ImageBackground style={styles.container} source={require('../Assets/Backgrounds/GridBG.png')}>
				<View style={{width: this.boardSize, height: this.boardSize, flex: null, borderRadius: 20, zIndex: 1}}>
					{/* Blue Player */}
					<Player positions={[Constants.CELL_SIZE * 9, 0]} color={'blue'} />
					{/* Green Player */}
					<Player positions={[0, Constants.CELL_SIZE * 9]} color={'green'} />
					{/* Red Player */}
					<Player positions={[0, 0]} color={'red'} />
					{/* Yellow Player */}
					<Player positions={[Constants.CELL_SIZE * 9, Constants.CELL_SIZE * 9]} color={'yellow'} />
					{/* Top Container */}
					<VerticalCellContainer positions={'top'} game2 />
					{/* Bottom Container */}
					<VerticalCellContainer positions={'bottom'} game2 />
					{/* Left Container */}
					<HorizontalCellContainer positions={'left'} game2 />
					{/* Right Container */}
					<HorizontalCellContainer positions={'right'} game2 />
					{/* Center */}
					<Center game2 />
					{/* Array Of Pieces */}
					{this.state.pieces.map((item, index) => (
						<Piece
							position={item.position}
							size={item.size}
							color={item.color}
							onTouch={() => this.onPieceTouch(item, 1, 52)}
							name={item.name}
							key={index}
							currentUser="green"
						/>
					))}
				</View>
			</ImageBackground>
		);
	}
}
