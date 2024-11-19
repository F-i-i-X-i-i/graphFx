//матрица смежности
//TODO остальные способы ввода

import { start } from "repl";
import * as Interface from "../interface/graphFx"
import { EdgeStyleKey } from "../styles/edgeStyle";
import { NodeStyleKey } from "../styles/nodeStyle";
//я щас заплачу

class JsoMatrix implements Interface.GraphFx {
    readonly nodeList: Interface.NodeFx[] = [];
    error: string;
    constructor(input ?: string) {
        this.nodeList = [];
        this.error = '';
        if (input) {
            console.warn(input);
            this.nodeList = this.create(input);
        }
        //console.log(this.isDirected());
    }
    
    create(input: string): Interface.NodeFx[] {
        try {
            const jsonData = JSON.parse(input);
            console.log(jsonData);
            
            const nodeList = jsonData.nodeList;

// Создаем ноды
            const nodes : Interface.NodeFx[] = [];
            for (let i = 0; i < nodeList.length; i++) {
            const node = nodeList[i];
          
        const point = node.point;

        point.SetX = (d: Interface.NodeFx, x: number) => {
        if (d.point) {
            d.point.x = x;
        }
        };

        point.SetY = (d: Interface.NodeFx, y: number) => {
        if (d.point) {
            d.point.y = y;
        }
        };

        point.GetX = (d: Interface.NodeFx): number => {
        return d.point ? d.point.x : 0;
        };

        point.GetY = (d: Interface.NodeFx): number => {
        return d.point ? d.point.y : 0;
        };
            const newNode: Interface.NodeFx = {
                name: node.name,
                in: [],
                out: [],
                style: node.style,
                group: node.group,
                point: node.point,
            };
            nodes.push(newNode);
            }

// Создаем ребра
            for (let i = 0; i < nodeList.length; i++) {
            const node = nodeList[i];
            const currentNode = nodes.find((n) => n.name === node.name);
            if (currentNode)
            for (let j = 0; j < node.in.length; j++) {
                const edge = node.in[j];
                const startNode = nodes.find((n) => n.name === edge.start);
                const endNode = nodes.find((n) => n.name === edge.end);
                if (startNode && endNode) {
                    const newEdge: Interface.EdgeFx = {
                    start: startNode,
                    end: endNode,
                    weight: edge.weight,
                    style: edge.style
                    };
                    currentNode.in.push(newEdge);
                }
            }
            if (currentNode)
            for (let j = 0; j < node.out.length; j++) {
                const edge = node.out[j];
                const startNode = nodes.find((n) => n.name === edge.start);
                const endNode = nodes.find((n) => n.name === edge.end);
                if (startNode && endNode) {
                const newEdge: Interface.EdgeFx = {
                start: startNode,
                end: endNode,
                weight: edge.weight,
                style: edge.style
                };
                currentNode.out.push(newEdge);
            }
            }
        }
        return nodes;
          } catch (error) {
            console.error(error);
            this.error = 'Ошибка: файл поврежден, ошибка выведена в консоль.';
            return [];
          }
    }
  
    isDirected(): boolean {
      for (let i = 0; i < this.nodeList.length; i++) {
        for (let j = i + 1; j < this.nodeList.length; j++) {
          if (this.nodeList[i].out.find(edge => edge.end === this.nodeList[j])?.weight !== this.nodeList[j].out.find(edge => edge.end === this.nodeList[i])?.weight) {
            return true;
          }
        }
      }
      return false;
    }
  
    calcCoordinates(SVG_WIDTH: number, SVG_HEIGHT: number) {
      const nodeList = this.nodeList;
      const radius = 200; // радиус окружности
      const centerX = SVG_WIDTH / 2; // координата x центра окружности
      const centerY = SVG_HEIGHT / 2; // координата y центра окружности
      for (let i = 0; i < nodeList.length; i++) {
        const angle = (2 * Math.PI * i) / nodeList.length; // угол для текущей вершины
        const x = centerX + radius * Math.cos(angle); // координата x текущей вершины
        const y = centerY + radius * Math.sin(angle); // координата y текущей вершины
        if (!nodeList[i].point)
        nodeList[i].point = {
          x: x,
          y: y,
          SetX: (d: Interface.NodeFx, x: number) => {
            if (d.point) {
              d.point.x = x;
            }
          },
          SetY: (d: Interface.NodeFx, y: number) => {
            if (d.point) {
              d.point.y = y;
            }
          },
          GetX: (d: Interface.NodeFx): number => {
            return d.point ? d.point.x : 0;
          },
          GetY: (d: Interface.NodeFx): number => {
            return d.point ? d.point.y : 0;
          },
        };
      }
    }
  }
  
  //TODO дописать проверки ввода
  
  export { JsoMatrix };
