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
    ordinalF?: number;
}

interface GraphFx {
    nodeList: NodeFx[];
    create(input: string) : NodeFx[];
    isDirected() : boolean;
    calcCoordinates(SVG_WIDTH : number, SVG_HEIGHT : number) : void;
}

interface GraphFxAlgs {
    graph : GraphFx;
    isDirected : boolean;
    ordinalError : string;
    dijkstra(nameStart: NodeFx, nameEnd: NodeFx) : string;
    connectedComponents() : void;
    findOrdinalFunction() : string;
    //TODO добавить алгоритмы
}
export type { EdgeFx, NodeFx, GraphFx, GraphFxAlgs, PointFx };
