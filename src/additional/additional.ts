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


export { coordsOnBorder };

