
function coordsOnBorder(coord: number, maxCoord: number): number {
    if (coord <= 0) {
      return 1;
    } else if (coord >= maxCoord) {
      return maxCoord - 1;
    } else {
      return coord;
    }
  }

  function rxSize(num: number): number {
    const result = 20 + (Math.abs(num).toString().length - 1) * 10;

    return result;
  }


export { coordsOnBorder, rxSize };

