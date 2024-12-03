//матрица смежности
//TODO остальные способы ввода

import * as Interface from "../interface/graphFx"
import { EdgeStyleKey } from "../styles/edgeStyle";
import { NodeStyleKey } from "../styles/nodeStyle";
//я щас заплачу

class LisMatrix implements Interface.GraphFx {
    readonly nodeList: Interface.NodeFx[];


    constructor(input ?: string) {
        this.nodeList = [];
        //console.log(input);
        if (input) 
            this.nodeList = this.create(input);

        console.log(this.isDirected());
    }

    create(input : string) : Interface.NodeFx[] {
        const rows = input.split('\n');
        const nodeList: Interface.NodeFx[] = [];
        let NodeCount = 0;
        for (let i = 0; i < rows.length; ++i){
            const row = rows[i].split(' ');
            const start = parseInt(row[0]);
            const end = parseInt(row[1]);
            if (start + 1 > NodeCount) 
                NodeCount = start + 1;
            if (end + 1 > NodeCount)
                NodeCount = end + 1;
        }

        for (let i = 0; i < NodeCount; i++) {
            const node: Interface.NodeFx = {
                name: `Node ${i}`,
                in: [],
                out: [],
                style: NodeStyleKey.DEFAULT
            };
            nodeList.push(node);
        }
        console.warn(nodeList);

        for (let i = 0; i < rows.length; ++i){
            const row = rows[i].split(' ');
            const [start, end, weight] = [parseInt(row[0]), parseInt(row[1]), parseInt(row[2])];
            console.log('\tstart = ', start, '; end = ', end);
            const edge: Interface.EdgeFx = {
                start: nodeList[start],
                end: nodeList[end],
                weight: weight,
                style: EdgeStyleKey.DEFAULT
            };
            nodeList[start].out.push(edge);
            nodeList[end].in.push(edge);

            
        }


        return nodeList;
    }

    isDirected(): boolean {
        for (let i = 0; i < this.nodeList.length; i++) {
            for (let j = i + 1; j < this.nodeList.length; j++) {
                if (this.nodeList[i].out.find(edge => edge.end === this.nodeList[j])?.weight  !== this.nodeList[j].out.find(edge => edge.end === this.nodeList[i])?.weight
                    ) {
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

export { LisMatrix };
