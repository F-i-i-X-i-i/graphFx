import { EdgeStyleKey } from "../styles/edgeStyle";
import { NodeStyleKey } from "../styles/nodeStyle";

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
    style: EdgeStyleKey;
}

type NodeFx = {
    in: EdgeFx[];
    out: EdgeFx[];
    name: string;
    point?: PointFx;
    style: NodeStyleKey;
    group?: number;
}

interface GraphFx {
    nodeList: NodeFx[];
    create(input: string) : NodeFx[];
    isDirected() : boolean;
    calcCoordinates(SVG_WIDTH : number, SVG_HEIGHT : number) : void;
}

interface GraphFxAlgs {
    graph : GraphFx;
    dijkstra(nameStart: NodeFx, nameEnd: NodeFx) : EdgeFx[];
    connectedComponents() : void;
    //TODO добавить алгоритмы
}
export type { EdgeFx, NodeFx, GraphFx, GraphFxAlgs, PointFx };
