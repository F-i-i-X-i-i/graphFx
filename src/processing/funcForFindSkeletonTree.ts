import * as Interface from "../interface/graphFx"


function additionToFull(X1: Interface.NodeFx[], nodeList: Interface.NodeFx[]): Interface.NodeFx[] {
    const X2: Interface.NodeFx[] = [];
    for (const node of nodeList) {
      if (!X1.includes(node) && !X2.includes(node)) {
        X2.push(node);
      }
    }
    return X2;
  }

function compare(currExt: Interface.EdgeFx | undefined, applicant: Interface.EdgeFx, type: string) {
    return currExt === undefined || (type === 'MIN' ? currExt.weight >= applicant.weight : currExt.weight <= applicant.weight);
}

function getEdgeWithExtremalStepDistance(x1: Interface.NodeFx[], x2: Interface.NodeFx[], type: string) : Interface.EdgeFx | undefined {
    let result : Interface.EdgeFx | undefined = undefined;
    
    for (let i = 0; i < x1.length; ++i)
        for (let j = 0; j < x1[i].out.length; ++j) {
            if (x1.find((e) => e === x1[i].out[j].end))
                continue;
            if (compare(result, x1[i].out[j], type)) {
                result = x1[i].out[j]; 
            }
        }
            
    return result;
}


export { additionToFull, getEdgeWithExtremalStepDistance }