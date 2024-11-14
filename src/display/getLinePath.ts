
import * as Interface from "../interface/graphFx";
import { calcMiddlePoint } from "./coords";

function getLinePath(e : Interface.EdgeFx, isDirected : boolean, CURVE_OFFSET : number) {
    const x1 = e.start.point?.GetX(e.start);
    const x2 = e.end.point?.GetX(e.end);
    const y1 = e.start.point?.GetY(e.start);
    const y2 = e.end.point?.GetY(e.end);
    if (isDirected) {
      const [midX, midY] = calcMiddlePoint(e, CURVE_OFFSET);
      console.log('IN LINE: ', midX, midY);
      return `M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`;
    } else {
      return `M ${x1} ${y1} L ${x2} ${y2}`;
    }
  }

export {getLinePath }