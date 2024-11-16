//алгоритмы (очевидно)
import { start } from "repl";
import * as Interface from "../interface/graphFx"
import { EdgeStyleKey, EdgeStyle } from "../styles/edgeStyle";
import { NodeStyleKey } from "../styles/nodeStyle";

class GraphFxAlgs implements Interface.GraphFxAlgs {
    readonly graph : Interface.GraphFx;

    constructor(graph : Interface.GraphFx) {
        this.graph = graph;
    }

    
    //TODO реализации алгоритмов
    dijkstra(startNode: Interface.NodeFx, endNode: Interface.NodeFx) : Interface.EdgeFx[] {

        if (!startNode || !endNode) {
            console.error('одна из нод - None');
            return [];
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
            return [];
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

        return path;
    }
}

export { GraphFxAlgs };