//матрица смежности
//TODO ДОДЕЛАТЬ

import * as Interface from "../interface/graphFx"
import { EdgeStyleKey } from "../styles/edgeStyle";
import { NodeStyleKey } from "../styles/nodeStyle";
//я щас заплачу

class IncMatrix implements Interface.GraphFx {
    readonly nodeList: Interface.NodeFx[];

    constructor(input ?: string) {
        this.nodeList = [];
        if (input) 
            this.nodeList = this.create(input);

        //console.log(this.isDirected());
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
                style: NodeStyleKey.DEFAULT
            };
            nodeList.push(node);
        }
        const columns = rows[0].split(' ').map((_, i) => {
            return rows.map(row => row.split(' ')[i]);
          });

        console.warn('columns: ', columns);

        for (let i = 0; i < columns.length; i++) {
            const col = columns[i].map(Number);
            const indices = col.map((x, index) => x !== 0 ? index : null).filter(x => x !== null);
            console.warn(indices);
            if (indices.length !== 2) {
                console.error('ОШИБКА ВВОДА');
            } else {
                
                let [i1, i2] = indices;
                if (i1 != null && i2 != null){
                    if (col[i1] < 0) {
                        let a = i2;
                        i2 = i1;
                        i1 = a;
                    }
                    const edge: Interface.EdgeFx = {
                        start: nodeList[i1],
                        end: nodeList[i2],
                        weight: col[i2],
                        style: EdgeStyleKey.DEFAULT
                    };
                    nodeList[i1].out.push(edge);
                    nodeList[i2].in.push(edge);
                } else {
                    console.error('ОШИБКА ОПРЕДЛЕНИЯ i1 = ', i1, '; i2 = ', i2);
                }
            } 
            
        }
        return nodeList;
    }


    isDirected(): boolean {
        for (let i = 0; i < this.nodeList.length; i++) {
            for (let j = i + 1; j < this.nodeList.length; j++) {
                if (this.nodeList[i].out.find(edge => edge.end === this.nodeList[j]) &&
                    !this.nodeList[j].out.find(edge => edge.end === this.nodeList[i])) {
                    return true;
                }
            }
        }
        return false;
    }


    calcCoordinates(SVG_WIDTH : number, SVG_HEIGHT : number) {
        const nodeList = this.nodeList;
        const radius = 200; // радиус окружности
        const centerX = SVG_WIDTH / 2; // координата x центра окружности
        const centerY = SVG_HEIGHT / 2; // координата y центра окружности
        for (let i = 0; i < nodeList.length; i++) {
          const angle = (2 * Math.PI * i) / nodeList.length; // угол для текущей вершины
          const x = centerX + radius * Math.cos(angle); // координата x текущей вершины
          const y = centerY + radius * Math.sin(angle); // координата y текущей вершины
          nodeList[i].point = { 
            x: x, 
            y: y,
            SetX: (d : Interface.NodeFx, x : number) => {
              if (d.point) {
                d.point.x = x;
              }},
            SetY: (d : Interface.NodeFx, y : number) => {
              if (d.point) {
                d.point.y = y;
              }
            },
            GetX: (d : Interface.NodeFx) : number => {
              return d.point? d.point.x : 0;
            },
            GetY: (d : Interface.NodeFx) : number => {
              return  d.point? d.point.y : 0;
            },
          };
        }

    }


    addNode(nodeName: string): string {
      
        const newNode: Interface.NodeFx = {
            name: nodeName,
            in: [],
            out: [],
            style: NodeStyleKey.DEFAULT,
        };
  
        if (this.nodeList.some((node) => node.name === nodeName))
          return 'Вершина с указанным именем уже существует.';
        else {
          this.nodeList.push(newNode);
          return '';
        }
    }
  
    removeNode(nodeName: string): string {
        const index = this.nodeList.findIndex((node) => node.name === nodeName);
        if (index !== -1) {
            this.nodeList.splice(index, 1);
  
            // Удалить все ребра, связанные с удаленным узлом
            this.nodeList.forEach((node) => {
                node.in = node.in.filter((edge) => edge.start.name !== nodeName);
                node.out = node.out.filter((edge) => edge.end.name !== nodeName);
            });
            return '';
        } else return 'Ошибка при удалении: вершина не найдена.';
    }
  

    addEdge(startNode: Interface.NodeFx, endNode: Interface.NodeFx, weight: number): string {
    

        if (weight <= 0) 
          return 'Вес ребра должен быть натуральным числом.';
  
        if (startNode && endNode) {
            const newEdge: Interface.EdgeFx = {
                start: startNode,
                end: endNode,
                weight: weight,
                style: EdgeStyleKey.DEFAULT,
            };
  
            startNode.out.push(newEdge);
            endNode.in.push(newEdge);
            return '';
        } else return 'Ребро не найдено.'
    }

    removeEdge(startNode: Interface.NodeFx, endNode: Interface.NodeFx): string {
  
  
  
        if (startNode && endNode) {
            startNode.out = startNode.out.filter((edge) => edge.end !== endNode);
            endNode.in = endNode.in.filter((edge) => edge.start !== startNode);
            return '';
        } else return 'Ребро не найдено.'
    }

}

//TODO дописать проверки ввода

export { IncMatrix };
