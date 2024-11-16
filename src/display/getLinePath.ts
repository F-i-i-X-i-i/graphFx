
import * as Interface from "../interface/graphFx";
import { calcMiddlePoint } from "./coords";

function getLinePath(e : Interface.EdgeFx, isDirected : boolean, CURVE_OFFSET : number, NODE_RADIUS : number) {
    if (e.start === e.end) {
      let offsetForLoop = 0;
      // петля
      if (isDirected) {
        offsetForLoop = 15;
      }
      const x = e.start.point?.GetX(e.start);
      const y = e.start.point?.GetY(e.start);
      return `M ${x} ${y} L ${x + NODE_RADIUS + offsetForLoop} ${y} A ${NODE_RADIUS + offsetForLoop} ${NODE_RADIUS + offsetForLoop} 0 1 1 ${x} ${y + NODE_RADIUS + offsetForLoop} L ${x} ${y}`;
    }

    const x1 = e.start.point?.GetX(e.start);
    const x2 = e.end.point?.GetX(e.end);
    const y1 = e.start.point?.GetY(e.start);
    const y2 = e.end.point?.GetY(e.end);
    
    if (isDirected) {
      const [midX, midY] = calcMiddlePoint(e, CURVE_OFFSET);
      return `M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`;
    } else {
      return `M ${x1} ${y1} L ${x2} ${y2}`;
    }
  }

export {getLinePath }