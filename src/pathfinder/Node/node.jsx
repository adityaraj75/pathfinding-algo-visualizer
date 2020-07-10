import React, {Component} from 'react';

import './node.css';

export default class Node extends Component {
	render() {
		const {
			col,
			isFinish,
			isStart,
			isBarrier,
			onMouseDown,
			onMouseEnter,
			onMouseUp,
			onMouseClick,
			row,
		} = this.props;

		const extraClassName = isFinish
		? 'node-finish'
		: isStart
		? 'node-start'
		: isBarrier
		? 'node-Barrier'
		: '';

		return (
		<div
			id={`node-${row}-${col}`}
			className={`node ${extraClassName}`}
			onMouseDown = {() => onMouseDown(row, col)}
			onMouseEnter = {() => onMouseEnter(row, col)}
			onMouseUp = {() => onMouseUp()}
			onClick = {() => onMouseClick(row, col)}
		/>
		);
	}
}