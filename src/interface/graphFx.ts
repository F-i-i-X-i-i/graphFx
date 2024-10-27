type PointFx = {
    x : number;
    y : number;
}

type EdgeFx = {
    start: NodeFx;
    end: NodeFx;
    weight: number;
}

type NodeFx = {
    in: EdgeFx[];
    out: EdgeFx[];
    name: string;
    point?: PointFx;
}

interface GraphFx {
    readonly nodeList: NodeFx[];
    create(input: string) : NodeFx[];
}

interface GraphFxAlgs {
    graph : GraphFx;

    calcCoordinates() : NodeFx[];
    
    dfs() : NodeFx[];
    //TODO добавить алгоритмы
}
export type { EdgeFx, NodeFx, GraphFx, GraphFxAlgs, PointFx };
