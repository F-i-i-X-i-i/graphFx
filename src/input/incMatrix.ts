//матрица смежности
//TODO ДОДЕЛАТЬ

import * as Interface from "../interface/graphFx"
//я щас заплачу

class IncMatrix implements Interface.GraphFx {
    readonly nodeList: Interface.NodeFx[];
    constructor(input ?: string) {
        this.nodeList = [];
        if (input) {
            this.nodeList = this.create(input);
        }
    }

    create(input : string) : Interface.NodeFx[] {
        //console.log(input);
        const rows = input.trim().split('\n');
        const nodeList: Interface.NodeFx[] = [];

        for (let i = 0; i < rows.length; i++) {
            const node: Interface.NodeFx = {
                name: `Node ${i}`,
                in: [],
                out: [],
            };
            nodeList.push(node);
        }

        for (let i = 0; i < rows[0].length; i++) {
            const row = rows[i].split(' ').map(Number);
            for (let j = 0; j < row.length; j++) {
                if (row[j] === 1) {
                    const edge: Interface.EdgeFx = {
                        start: nodeList[i],
                        end: nodeList[j],
                        weight: 1 
                    };
                    nodeList[i].out.push(edge);
                    nodeList[j].in.push(edge);
                }
            }
        }
        return nodeList;
    }

}

//TODO дописать проверки ввода

export { IncMatrix };
