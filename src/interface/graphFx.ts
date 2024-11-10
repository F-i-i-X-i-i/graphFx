type PointFx = {
    x : number;
    y : number;
    SetX : Function;
    SetY : Function;
    GetX : Function;
    GetY : Function;
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
    nodeList: NodeFx[];
    create(input: string) : NodeFx[];
}

interface GraphFxAlgs {
    graph : GraphFx;
    dfs() : NodeFx[];
    //TODO добавить алгоритмы
}
export type { EdgeFx, NodeFx, GraphFx, GraphFxAlgs, PointFx };
