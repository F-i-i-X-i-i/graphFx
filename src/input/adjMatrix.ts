//матрица смежности
//TODO остальные способы ввода

import * as Interface from "../interface/graphFx"
//я щас заплачу

class AdjMatrix implements Interface.GraphFx {
    readonly nodeList: Interface.NodeFx[];
    constructor(input ?: string) {
        this.nodeList = [];
        if (input) {
            this.nodeList = this.create(input);
        }
    }
    
    create(input : string) : Interface.NodeFx[] {
        const rows = input.trim().split('\n');
        const nodeList: Interface.NodeFx[] = [];
        //ПИШЕМ РК
        // Проверка 0: не пустая матрица
        console.log(input);
        if (input === "") {
            console.log('Матрица должна быть не пустой');
            throw new Error('Матрица должна быть не пустой');
        }
        const expectedLength = rows.length;

        // Проверка 1: матрица должна быть квадратной
        if (!rows.every(row => row.split(' ').length === expectedLength)) {
            console.log('Матрица должна быть квадратной');
            throw new Error('Матрица должна быть квадратной');
        }

        // Проверка 2: все элементы матрицы должны быть числами
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i].split(' ').map(Number);
            if (row.some(isNaN)) {
                console.log('Все элементы матрицы должны быть числами');
                throw new Error('Все элементы матрицы должны быть числами');
            }
        }


        for (let i = 0; i < rows.length; i++) {
            const node: Interface.NodeFx = {
                name: `Node ${i}`,
                in: [],
                out: []
            };
            nodeList.push(node);
        }
        for (let i = 0; i < rows.length; i++) {
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

//TODO дописать export см graphFx
export { AdjMatrix };
