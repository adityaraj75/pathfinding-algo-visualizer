import React, {Component} from 'react';
import Node from './Node/node';
import './pathfinder.css';
import {dijkstra, getNodesInShortestPath} from '../algorithms/dijkstra';

const TOTAL_ROW = 30;
const TOTAL_COL = 50;

export default class Pathfinder extends Component
{
	constructor()
	{
		super();
		this.state = {
			grid: [],
			mouseIsPressed: false,
			isSelectingStart: false,
			isSelectingEnd: false,
			isSelectingBarrier: true,
			startNodeRow: -1,
			startNodeCol: -1,
			endNodeRow: -1,
			endNodeCol: -1
		};
	}

	componentDidMount() 
	{
		const grid = getInitialGrid();
		this.setState({grid});
	}

	handleMouseDown(row, col) 
	{
		if(!(this.state.isSelectingStart || this.state.isSelectingEnd))
		{
			const newGrid = getNewGridWithBarrierToggled(this.state.grid, row, col);
			this.setState({grid: newGrid, mouseIsPressed: true});
		}
	}

	handleMouseEnter(row, col) 
	{
		if (!this.state.mouseIsPressed) return;
		if(this.state.isSelectingBarrier)
		{
			const newGrid = getNewGridWithBarrierToggled(this.state.grid, row, col);
			this.setState({grid: newGrid});
		}
	}

	handleMouseUp() 
	{
		this.setState({mouseIsPressed: false});
	}

	handleNodeClicked(row, col)
	{
		if(this.state.isSelectingStart)
		{
			const newGrid = getNewGridWithStartNode(this.state.grid, row, col, this.state.startNodeRow, this.state.startNodeCol);
			this.setState({isSelectingStart: false, grid: newGrid, startNodeRow: row, startNodeCol: col});
		}
		else if (this.state.isSelectingEnd)
		{
			const newGrid = getNewGridWithEndNode(this.state.grid, row, col,this.state.endNodeRow, this.state.endNodeCol);
			this.setState({isSelectingEnd: false, grid: newGrid, endNodeRow: row, endNodeCol: col});
		}
		
	}

	animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) 
	{
		for (let i = 0; i <= visitedNodesInOrder.length; i++) 
		{
			if (i === visitedNodesInOrder.length) 
			{
				setTimeout(() => {
					this.animateShortestPath(nodesInShortestPathOrder);
				}, 10 * i);
				
				return;
			}
			setTimeout(() => {
			const node = visitedNodesInOrder[i];
			if((node.row !== this.state.startNodeRow || node.col !== this.state.startNodeCol) && (node.col !== this.state.endNodeCol || node.row !== this.state.endNodeRow))
				{
					document.getElementById(`node-${node.row}-${node.col}`).className =
						'node node-visited';
				}	
			}, 10 * i);
		}
	}
	
	animateShortestPath(nodesInShortestPathOrder) 
	{
		for (let i = 1; i < nodesInShortestPathOrder.length -1; i++) 
		{
			setTimeout(() => 
			{
				const node = nodesInShortestPathOrder[i];
				document.getElementById(`node-${node.row}-${node.col}`).className =
				'node node-shortest-path';
			}, 50 * i);
		}
	}
		
	visualizeDijkstra() 
	{
		if(this.state.endNodeRow !== -1 && this.state.startNodeRow !== -1)
		{
			const {grid} = this.state;
			const startNode = grid[this.state.startNodeRow][this.state.startNodeCol];
			const finishNode = grid[this.state.endNodeRow][this.state.endNodeCol];
			const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
			const nodesInShortestPathOrder = getNodesInShortestPath(finishNode);
			this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
		}
	}

	toggleSelectingStart()
	{
		this.setState({isSelectingStart: true});
	}

	toggleSelectingEnd()
	{
		this.setState({isSelectingEnd: true});
	}

	toggleSelectingBarriers()
	{
		this.setState({isSelectingBarrier: true});
	}

	clearGrid()
	{
		const newGrid = this.state.grid.slice();
		for(let row = 0; row < TOTAL_ROW; row++)
		{
			for(let col = 0; col < TOTAL_COL; col++)
			{
				const oldNode = newGrid[row][col];
				const newNode = {
					...oldNode,
					isStart: false,
					isFinish: false,
					isBarrier: false,
				};
				newGrid[row][col] = newNode;
				document.getElementById(`node-${row}-${col}`).className = 'node';
			}
		}
		this.setState({
			grid: newGrid,
			mouseIsPressed: false,
			isSelectingStart: false,
			isSelectingEnd: false,
			isSelectingBarrier: true,
			startNodeRow: -1,
			startNodeCol: -1,
			endNodeRow: -1,
			endNodeCol: -1 
		})
	}

	render() 
	{
		const {grid, mouseIsPressed} = this.state;
		return (
		<>
			<nav class="navbar navbar-expand-lg navbar-light bg-light">
				<a class="navbar-brand">Pathfinding Algorithms Visualizer</a>
				<div class="collapse navbar-collapse" id="navbarSupportedContent">
					<ul class="navbar-nav mr-auto">
						<li class="nav-item dropdown">
							<a class="nav-item nav-link dropdown-toggle" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
								Select Algorithm
							</a>
							<div class="dropdown-menu" aria-labelledby="navbarDropdown">
								<button class="btn dropdown-item" onClick={() => this.visualizeDijkstra()}>
									Dijkstra's Algorithm
								</button>
							</div>
						</li>
						<li class = "nav-item">
							<button class = "btn btn-success navbar-btn" onClick={() => this.toggleSelectingStart()}>Select Start Node</button>
						</li>
						<li class = "nav-item">
							<button class = "btn btn-danger navbar-btn" onClick={() => this.toggleSelectingEnd()}>Select End Node</button>
						</li>
						<li class = "nav-item">
							<button class = "btn btn-dark navbar-btn" onClick={() => this.clearGrid()}>Clear Grid</button>
						</li>
					</ul>
				</div>
			</nav>
			<div className="gridContainer">
				<div className="grid">
					{grid.map((row, rowIdx) => {
					return (
						<div key={rowIdx} className = "node-row">
						{row.map((node, nodeIdx) => {
							const {row, col, isFinish, isStart, isBarrier} = node;
							return (
								<Node
									row = {row}
									col = {col}
									isFinish = {isFinish}
									isStart = {isStart}
									isBarrier = {isBarrier}
									key = {nodeIdx}
									mouseIsPressed = {mouseIsPressed}
									onMouseDown = {(row, col) => this.handleMouseDown(row, col)}
									onMouseEnter = {(row, col) => this.handleMouseEnter(row, col)}
									onMouseUp = {() => this.handleMouseUp()}
									onMouseClick = {(row, col) => this.handleNodeClicked(row, col)} 
								/>
							);
						})}
						</div>
					);
					})}
				</div>
			</div>
		</>
		);
	}
}

const getInitialGrid = () => {
	const grid = [];
	for (let row = 0; row < TOTAL_ROW; row++) 
	{
		const currentRow = [];
		for (let col = 0; col < TOTAL_COL; col++) 
		{
			currentRow.push(createNode(col, row));
		}
		grid.push(currentRow);
	}

	return grid;
};

const createNode = (col, row) => {
	return {
		col,
		row,
		isStart: false,
		isFinish: false,
		distance: Infinity,
		isVisited: false,
		isBarrier: false,
		previousNode: null,
	};
};

const getNewGridWithBarrierToggled = (grid, row, col) => {
	const newGrid = grid.slice();
	const node = newGrid[row][col];
	const newNode = {
		...node,
		isBarrier: !node.isBarrier,
	};
	newGrid[row][col] = newNode;
	return newGrid;
};

const getNewGridWithStartNode = (grid, row, col, oldRow, oldCol) => {
	const newGrid = grid.slice();
	if(oldRow !== -1)
	{
		const oldStart = newGrid[oldRow][oldCol];
		const cleanOldStart = {
			...oldStart,
			isStart: false,
		};
		newGrid[oldRow][oldCol] = cleanOldStart;
	}

	const node = newGrid[row][col];
	const newNode = {
		...node,
		isStart: true,
	};

	newGrid[row][col] = newNode;
	return newGrid;
}

const getNewGridWithEndNode = (grid, row, col, oldRow, oldCol) => {
	const newGrid = grid.slice();
	if(oldRow !== -1)
	{
		const oldFinish = newGrid[oldRow][oldCol];
		const cleanOldFinish = {
			...oldFinish,
			isFinish: false,
		};
		newGrid[oldRow][oldCol] = cleanOldFinish;
	}

	const node = newGrid[row][col];
	const newNode = {
		...node,
		isFinish: true,
	};

	newGrid[row][col] = newNode;
	return newGrid;
}
