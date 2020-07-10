export function dijkstra(grid, startNode, finishNode) 
{
	const visitedNodesInOrder = [];
	startNode.distance = 0;
	const unvisitedNodes = getAllNodes(grid);
	while (!!unvisitedNodes.length) 
	{
		sortNodesByDistance(unvisitedNodes);
		const closestNode = unvisitedNodes.shift();
		if (closestNode.isBarrier) continue;
		if (closestNode.distance === Infinity) return visitedNodesInOrder;
		closestNode.isVisited = true;
		visitedNodesInOrder.push(closestNode);
		if (closestNode === finishNode) return visitedNodesInOrder;
		updateUnvisitedNeighbors(closestNode, grid);
	}
}

function sortNodesByDistance(unvisitedNodes) 
{
	unvisitedNodes.sort((node1, node2) => node1.distance - node2.distance);
}

function updateUnvisitedNeighbors(node, grid) 
{
	const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
	for (const neighbor of unvisitedNeighbors) 
	{
		neighbor.distance = node.distance + 1;
		neighbor.previousNode = node;
	}
}

function getUnvisitedNeighbors(node, grid) 
{
	const neighbors = [];
	const {col, row} = node;
	if (row > 0) neighbors.push(grid[row - 1][col]);
	if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
	if (col > 0) neighbors.push(grid[row][col - 1]);
	if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
	return neighbors.filter(neighbor => !neighbor.isVisited);
}

function getAllNodes(grid) 
{
	const allNodes = [];
	for (const row of grid) 
	{
		for (const node of row) 
		{
			allNodes.push(node);
		}
	}

	return allNodes;
}

export function getNodesInShortestPath(finishNode) 
{
	const nodesInShortestPath = [];
	let currNode = finishNode;
	while (currNode !== null)
	{
		nodesInShortestPath.unshift(currNode);
		currNode = currNode.previousNode;
	}

	return nodesInShortestPath;
}