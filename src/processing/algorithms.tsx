//алгоритмы (очевидно)
import * as Interface from "../interface/graphFx"

class GraphFxAlgs implements Interface.GraphFxAlgs {
    readonly graph : Interface.GraphFx;

    constructor(graph : Interface.GraphFx) {
        this.graph = graph;
    }

    
    //TODO реализации алгоритмов
    dfs() : Interface.NodeFx[] {
        return this.graph.nodeList
    }
}

export { GraphFxAlgs };