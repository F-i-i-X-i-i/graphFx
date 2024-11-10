import * as Interface from '../interface/graphFx';

function coordsOnBorder(coord: number, maxCoord: number): number {
    if (coord <= 0) {
      return 1;
    } else if (coord >= maxCoord) {
      return maxCoord - 1;
    } else {
      return coord;
    }
  }


  function isNodeTooClose(nodes: Interface.NodeFx[], node: Interface.NodeFx, x: number, y: number, minDistance: number) {
    // for (const otherNode of nodes) {
    //   if (otherNode === node) continue;
    //   const otherNodeX = otherNode.point?.GetX(otherNode);
    //   const otherNodeY = otherNode.point?.GetY(otherNode);
    //   const distance = Math.sqrt((x - otherNodeX) ** 2 + (y - otherNodeY) ** 2);
    //   if (distance < minDistance) {
    //     return true;
    //   }
    // }
    return false;
  }

export { coordsOnBorder, isNodeTooClose };

