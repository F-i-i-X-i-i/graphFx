//алгоритмы (очевидно)
import * as Interface from "../interface/graphFx"

class GraphFxAlgs implements Interface.GraphFxAlgs {
    readonly graph : Interface.GraphFx;

    constructor(graph : Interface.GraphFx) {
        this.graph = graph;
        this.calcCoordinates();
    }

    calcCoordinates() : Interface.NodeFx[] {
        const nodeList = this.graph.nodeList;
        const radius = 200; // радиус окружности
        const centerX = 400; // координата x центра окружности
        const centerY = 300; // координата y центра окружности

        for (let i = 0; i < nodeList.length; i++) {
            const angle = (2 * Math.PI * i) / nodeList.length; // угол для текущей вершины
            const x = centerX + radius * Math.cos(angle); // координата x текущей вершины
            const y = centerY + radius * Math.sin(angle); // координата y текущей вершины

            nodeList[i].point = { x, y };
        }

        return nodeList
    }
    
    //TODO реализации алгоритмов
    dfs() : Interface.NodeFx[] {
        return this.graph.nodeList
    }
}

export default GraphFxAlgs;