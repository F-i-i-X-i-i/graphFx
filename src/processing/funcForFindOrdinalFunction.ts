import * as Interface from "../interface/graphFx"


function createAdjacencyMatrix(nodeList: Interface.NodeFx[]): { [node: string]: { [node: string]: number } } {
    const adjacencyMatrix: { [node: string]: { [node: string]: number } } = {};

    nodeList.forEach(node => {
        adjacencyMatrix[node.name] = {};

        node.out.forEach(edge => {
            adjacencyMatrix[node.name][edge.end.name] = edge.weight;
        });
    });

    return adjacencyMatrix;
}

function calculateLambdaK(adjacencyMatrix: { [node: string]: { [node: string]: number } }): { [node: string]: number } {
    const lambdaK: { [node: string]: number } = {};

    Object.keys(adjacencyMatrix).forEach(node => {
        lambdaK[node] = 0;

        Object.keys(adjacencyMatrix).forEach(otherNode => {
            if (adjacencyMatrix[otherNode][node] !== undefined) {
                lambdaK[node]++;
            }
        });
    });

    return lambdaK;
}

function removeNodesFromAdjacencyMatrix(adjacencyMatrix: { [node: string]: { [node: string]: number } }, nodesToRemove: string[]): { [node: string]: { [node: string]: number } } {
    nodesToRemove.forEach(node => {
        delete adjacencyMatrix[node];

        Object.keys(adjacencyMatrix).forEach(otherNode => {
            delete adjacencyMatrix[otherNode][node];
        });
    });

    return adjacencyMatrix;
}

export { removeNodesFromAdjacencyMatrix, calculateLambdaK, createAdjacencyMatrix }