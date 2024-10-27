//матрица смежности
//TODO остальные способы ввода

import * as Interface from "../interface/graphFx"
//я щас заплачу

class AdjMatrix implements Interface.GraphFx {
    readonly nodeList: Interface.NodeFx[];
    constructor(input ?: string) {
        this.nodeList = [];
        if (input) {
            this.create(input);
        }
    }
    
    create(input : string) : Interface.NodeFx[] {
        //TODO реализация
        return this.nodeList
    }

}

//TODO дописать export см graphFx
