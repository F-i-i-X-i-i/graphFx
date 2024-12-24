import * as Interface from "../interface/graphFx";

function uniqName(name : string, d : Interface.NodeFx, nodeList: Interface.NodeFx[]) {
    if (name.trim() === '' || nodeList.some((node) => node.name === name && node !== d))
        return d.name;
    else return name;
}

function checkWeight(str1: string): boolean {
    const regex = /^\d+$/;
    if (regex.test(str1) && parseInt(str1) > 0) {
      return true;
    } else {
      return false;
    }
  }

export {uniqName, checkWeight}