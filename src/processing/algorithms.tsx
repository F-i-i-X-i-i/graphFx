//алгоритмы (очевидно)
import { start } from "repl";
import * as Interface from "../interface/graphFx"
import { EdgeStyleKey, EdgeStyle } from "../styles/edgeStyle";
import { NodeStyleKey } from "../styles/nodeStyle";
import { getTMinus, getTPlus, getIntersection } from "./funcForConnComps";
import { createAdjacencyMatrix, removeNodesFromAdjacencyMatrix, calculateLambdaK } from "./funcForFindOrdinalFunction";

class GraphFxAlgs implements Interface.GraphFxAlgs {
    readonly graph : Interface.GraphFx;
    readonly isDirected: boolean;
    readonly ordinalError: string;

    constructor(graph : Interface.GraphFx) {
        this.graph = graph;
        this.connectedComponents();
        this.isDirected = this.graph.isDirected();
        this.ordinalError = this.findOrdinalFunction();
    }

    
    //TODO реализации алгоритмов
    dijkstra(startNode: Interface.NodeFx, endNode: Interface.NodeFx) : string {

        if (!startNode || !endNode) {
            console.error('одна из нод не указана');
            return 'одна из вершин не указана';
        }

        if (startNode === endNode) {
            startNode.style = NodeStyleKey.PATH;
            return '';
        }

        const distances: { [key: string]: number } = {};
        const previous: { [key: string]: Interface.EdgeFx | null } = {};
        const queue: Interface.NodeFx[] = [];

        this.graph.nodeList.forEach((node) => {
            distances[node.name] = Infinity;
            previous[node.name] = null;
        });

        distances[startNode.name] = 0;
        queue.push(startNode);

        while (queue.length > 0) {
            const node = queue.shift() as Interface.NodeFx;
            if (node === endNode) {
                break;
            }

            node.out.forEach((edge) => {
                const distance = distances[node.name] + edge.weight;
                if (distance < distances[edge.end.name]) {
                    distances[edge.end.name] = distance;
                    previous[edge.end.name] = edge;
                    queue.push(edge.end);
                }
            });
        }

        
        if (!previous[endNode.name]) {
            console.error('Пути не существует');
            return 'Пути не существует';
        }

        const path: Interface.EdgeFx[] = [];
        let node = endNode;

        let edges = this.graph.nodeList.reduce((acc: Interface.EdgeFx[], node) => acc.concat(node.out), []);
        for (let i = 0; i <edges.length; ++i) 
            edges[i].style = EdgeStyleKey.DEFAULT;
        for (let i = 0; i <this.graph.nodeList.length; ++i) 
            this.graph.nodeList[i].style = NodeStyleKey.DEFAULT;
        let isDirected = this.graph.isDirected();
        while (node !== startNode) {
            const edge = previous[node.name];
            node.style = NodeStyleKey.PATH;
            if (isDirected) {
                if (edge) {
                    path.unshift(edge);
                    node = edge.start;
                    edge.style = EdgeStyleKey.PATH;
                }
            } else {
                if (edge) {
                    path.unshift(edge);
                    node = edge.start;
                    edge.style = EdgeStyleKey.PATH;

                    const target = this.graph.nodeList.find((n) => n === edge.end)?.out.find((e) => e.end === edge.start);
                    console.warn(target);
                    if (target) target.style = EdgeStyleKey.PATH;
                }
            }

        } 
        startNode.style = NodeStyleKey.PATH;

        return '';
    }

    connectedComponents() : void {
        console.log('CALC GROUPS');
        const graph = this.graph;
        const nodeList = graph.nodeList;
        const processedNodes: Interface.NodeFx[] = [];
        const groups: Interface.NodeFx[][] = [];
    
        for (let i = 0; i < nodeList.length; ++i) {
            if (processedNodes.includes(nodeList[i])) {
                continue;
            }
    
            const nodeListPlus = getTPlus(nodeList[i], this.graph);
            const nodeListMinus = getTMinus(nodeList[i], this.graph);
            const result_group = getIntersection(nodeListPlus, nodeListMinus);
            console.warn(result_group);
    
            groups.push(result_group);
            processedNodes.push(...result_group);
        }



        for (let i = 0; i < groups.length; ++i) 
            for (let j = 0; j < groups[i].length; ++j) 
                groups[i][j].group = i + 1;
        //TODO мб лучше в конструкторе один раз вызвать и забыть, чтобы каждый раз не пересчитывать 
        console.log(graph.nodeList);
    }   


    findOrdinalFunction(): string {
        const graph = this.graph;
        const nodeList = graph.nodeList;
        let adjacencyMatrix = createAdjacencyMatrix(nodeList);

        let k = 0;
        let ordinalFunction: { [node: string]: number } = {};
        console.log('MATRIX: ', adjacencyMatrix);
        while (true) {
            console.log('\n\tordinalFunction: ', ordinalFunction);
            const lambdaK = calculateLambdaK(adjacencyMatrix);
            console.log('\tlambdaK: ', lambdaK)
            const nodesWithZeroLambdaK = nodeList.filter(node => lambdaK[node.name] === 0);

            if (nodesWithZeroLambdaK.length === 0) {
                return "Порядковой функции графа не существует";
            }

            const levelK = nodesWithZeroLambdaK.map(node => node.name);
            for (let i = 0; i < levelK.length; ++i)
                ordinalFunction[levelK[i]] = k;
            

            if (Object.keys(ordinalFunction).length === nodeList.length) break;

            adjacencyMatrix = removeNodesFromAdjacencyMatrix(adjacencyMatrix, levelK);

            k++;
        }
        console.log('\n\tordinalFunction: ', ordinalFunction);
        for (let i = 0; i < nodeList.length; ++i) {
            nodeList[i].ordinalF = ordinalFunction[nodeList[i].name];
        }

        return '';
    }

    
}

export { GraphFxAlgs };