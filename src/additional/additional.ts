import * as Interface from '../interface/graphFx'

const SetX = (d : Interface.NodeFx) : number => {
    return d.point ? d.point.x : (() : number => { return 0; })();
}

const SetY = (d : Interface.NodeFx) : number => {
    return d.point ? d.point.y : (() : number => { return 0; })();
}

export { SetX, SetY };