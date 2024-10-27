//алгоритмы (очевидно)
import * as Interface from "../interface/graphFx"

class GraphFxAlgs implements Interface.GraphFxAlgs {
    readonly graph : Interface.GraphFx;

    constructor(graph : Interface.GraphFx) {
        this.graph = graph;
    }

    calcCoordinates() : Interface.NodeFx[] {
        //TODO рассчет координат (в NodeList для каждой ноды добавляем рассчитанную координату)
        return this.graph.nodeList
    }
    
    //TODO реализации алгоритмов
    dfs() : Interface.NodeFx[] {
        return this.graph.nodeList
    }
}