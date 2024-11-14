import * as Interface from "../interface/graphFx";


function setCurveOffset(node1: Interface.NodeFx, node2: Interface.NodeFx, CURVE_OFFSET : number) {
    return (node1.name > node2.name ? CURVE_OFFSET : CURVE_OFFSET );
  }

function lengthEdge(e: Interface.EdgeFx){
    const x1 = e.start.point?.GetX(e.start);
    const x2 = e.end.point?.GetX(e.end);
    const y1 = e.start.point?.GetY(e.start);
    const y2 = e.end.point?.GetY(e.end);
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
    
}

function calcMiddlePoint(e : Interface.EdgeFx, CURVE_OFFSET : number) {
    const x1 = e.start.point?.GetX(e.start);
    const y1 = e.start.point?.GetY(e.start);
    const x2 = e.end.point?.GetX(e.end);
    const y2 = e.end.point?.GetY(e.end);
    const sinAlpha = (y2 - y1) / lengthEdge(e); 
    const cosAlpha = (x1 - x2) / lengthEdge(e); 
    const midX = (x1 + x2) / 2 + setCurveOffset(e.start, e.end, CURVE_OFFSET) * sinAlpha;
    const midY = (y1 + y2) / 2 + setCurveOffset(e.start, e.end, CURVE_OFFSET) * cosAlpha;
    return [midX, midY];

}

function calcPointOnBezierCurve(e : Interface.EdgeFx, t : number, CURVE_OFFSET: number) {
    const x1 = e.start.point?.GetX(e.start);
    const y1 = e.start.point?.GetY(e.start);
    const x3 = e.end.point?.GetX(e.end);
    const y3 = e.end.point?.GetY(e.end);
    const [x2, y2] = calcMiddlePoint(e, CURVE_OFFSET);
  
    const x = (t - 1) * (t - 1) * x1 + 2 * t * (1 - t) * x2 + t * t * x3;
    const y = (t - 1) * (t - 1) * y1 + 2 * t * (1 - t) * y2 + t * t * y3;
    console.log('IN TEXT: ', x, y);
    return [x, y];
  }

export { calcMiddlePoint, calcPointOnBezierCurve  }