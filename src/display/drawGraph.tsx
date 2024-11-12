import React, { useRef, useEffect, useState } from "react";
import * as Interface from "../interface/graphFx";
import * as d3 from 'd3';
import { rxSize } from "../additional/additional";


const NODE_RADIUS = 20;

const TEXT_RADIUS= 7;
const TEXT_NODE_HEIGHT = 18;
const TEXT_NODE_OFFSET = 8;
const TEXT_NODE_WIDTH = 70;

const TEXT_EDGE_HEIGHT = 18;
const TEXT_Y_EDGE_OFFSET = TEXT_EDGE_HEIGHT / 2 - 2; //-2 потому что высота тыры пыры смещение все дела


const DrawGraph: React.FC<{ graph: Interface.GraphFx, width : number, height: number }> = ({ graph, width, height }) => {
  const SVG_WIDTH = width;
  const SVG_HEIGHT = height;
  const [nodes, setNodes] = useState<Interface.NodeFx[]>([]);
  const edges = nodes.reduce((acc: Interface.EdgeFx[], node) => acc.concat(node.out), []);
  const svgRef = useRef<SVGSVGElement>(null);

  
  const svg = d3.select(svgRef.current);
  if (!svg.select('defs').node()) {
    const marker = svg.append('defs')
      .append('marker')
      .attr('id', 'arrow')
      .attr('markerWidth', 10)
      .attr('markerHeight', 10)
      .attr('refX', 20)
      .attr('refY', 5)
      .attr('orient', 'auto');

    marker.append('path')
      .attr('d', 'M 0 0 L 10 5 L 0 10 Z')
      .attr('fill', 'black');
  }
  useEffect(() => {
    console.log('1st\n');
    if (svgRef.current) svgRef.current.innerHTML = '';
    const calcCoordinates = (graph : Interface.GraphFx) : Interface.NodeFx[] => {
      const nodeList = graph.nodeList;
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
              setNodes(nodes.map((node) => (node === d ? { ...node, point: { ...node.point, x } } : node) as Interface.NodeFx));
            }},
          SetY: (d : Interface.NodeFx, y : number) => {
            if (d.point) {
              d.point.y = y;
              setNodes(nodes.map((node) => (node === d ? { ...node, point: { ...node.point, y } } : node) as Interface.NodeFx));
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

      return nodeList;
    }
    setNodes(calcCoordinates(graph));
    
  }, [graph]);

  useEffect(() => {
    //console.log('2st\n');
    if (svgRef.current) {

      const svg = d3.select(svgRef.current);
      // Render Edges
      const edgeGroups = svg.selectAll<SVGGElement, Interface.EdgeFx>('g.edge')
        .data(edges)
        .enter()
        .append('g')
        .attr('class', 'edge');
        
      if (graph.isDirected())
        edgeGroups.append('line')
        .attr('stroke', 'black')
        .attr('stroke-width', '2')
        .attr('marker-end', 'url(#arrow)');
      else
        edgeGroups.append('line')
        .attr('stroke', 'black')
        .attr('stroke-width', '2')


      edgeGroups.append('rect')
        .attr("x", (e) => (e.start.point?.GetX(e.start) + e.end.point?.GetX(e.end) - rxSize(e.weight)) / 2)
        .attr("y", (e) => (e.start.point?.GetY(e.start) + e.end.point?.GetY(e.end) - TEXT_EDGE_HEIGHT) / 2)
        .attr("width", (e) => (rxSize(e.weight)))
        .attr("height", TEXT_EDGE_HEIGHT)
        .attr('stroke', 'gray')
        .attr('stroke-width', '0.2')
        .attr('rx', TEXT_RADIUS)
        .attr('ry', TEXT_RADIUS)
        .attr('opacity', 0.9)
        .attr('fill', '#F7F7F7');




      edgeGroups.append('text')
        .attr('x', (e) => (e.start.point?.GetX(e.start) + e.end.point?.GetX(e.end)) / 2)
        .attr('y', (e) => (e.start.point?.GetY(e.start) + e.end.point?.GetY(e.end)) / 2 +  TEXT_Y_EDGE_OFFSET)
        .attr('text-anchor', 'middle')
        .attr('fill', 'black')
        .attr('font-size', `${TEXT_EDGE_HEIGHT}px`)
        .text((e) => e.weight);
      // Initialize edges
      edgeGroups.selectAll<SVGLineElement, Interface.EdgeFx>('line')
        .attr('x1', (e) => {
          return e.start.point?.GetX(e.start);
        })
        .attr('y1', (e) => {
          return e.start.point?.GetY(e.start);
        })
        .attr('x2', (e) => {
          return e.end.point?.GetX(e.end);
        })
        .attr('y2', (e) => {
          return e.end.point?.GetY(e.end);
        });
    }
  }, [edges]);

  useEffect(() => {
    //console.log('3st\n');
    if (svgRef.current) {
      const svg = d3.select(svgRef.current);

      // Render Nodes
      const nodeGroups = svg.selectAll<SVGGElement, Interface.NodeFx>('g.node')
        .data(nodes)
        .enter()
        .append('g')
        .attr('class', 'node')
        .attr('transform', (d) => `translate(${d.point?.GetX(d)}, ${d.point?.GetY(d)})`);

      nodeGroups.append('circle')
        .attr('r', NODE_RADIUS)
        .attr('fill', 'lightblue')
        .attr('stroke', 'black')
        .attr('stroke-width', '2');

      //TODO андрей предложил расчитывать положение подписи через центр svg посмотри в вк
      nodeGroups.append('rect')
        .attr('x', NODE_RADIUS + TEXT_NODE_OFFSET - TEXT_NODE_WIDTH / 2)
        .attr('y', -NODE_RADIUS - TEXT_NODE_HEIGHT - TEXT_NODE_OFFSET)
        .attr("width", TEXT_NODE_WIDTH)
        .attr("height", TEXT_NODE_HEIGHT + 4)
        .attr('stroke', 'gray')
        .attr('stroke-width', '0.2')
        .attr('rx', TEXT_RADIUS)
        .attr('ry', TEXT_RADIUS)
        .attr('opacity', 0.9)
        .attr('fill', '#F2F2F2');

      nodeGroups.append('text')
        .attr('x', NODE_RADIUS + TEXT_NODE_OFFSET)
        .attr('y', -NODE_RADIUS - TEXT_NODE_OFFSET)
        .attr('font-size', `${TEXT_NODE_HEIGHT}px`)
        .attr('text-anchor', 'middle')
        .attr('fill', 'black')
        .text((d) => d.name);
    }
  }, [nodes]);


const [dragging, setDragging] = useState(false);
const [draggedNode, setDraggedNode] = useState<Interface.NodeFx | null>(null);
//TODO КАКАЯ ТО ОШИБКА ПРИ ПЕРЕМЕЩЕНИИ НОД, ОШИБКА В ВЫХОДЕ ИЗ РЕЖИМА (что-то типа вывод NODE 0 NODE 4)

//console.log(dragging, draggedNode);
useEffect(() => {
  //console.log('4st\n');
  if (svgRef.current) {
    const svg = d3.select(svgRef.current);

    let animationFrameId: number | null = null;

    svg.selectAll<SVGGElement, Interface.NodeFx>('g.node')
      .on('click', (event, d) => {
        //TODO вот тут прикол какой то происходит, см баг при перемешении где то в TODO было
        console.log('CLICK: ', dragging, draggedNode?.name, d.name);
        if (!dragging) {
          console.log('CLICKED');
          setDragging(true);
          setDraggedNode(d);
          d3.select(event.target.parentNode)
            .classed('dragged', true)
            .raise();
          d3.select(event.target)
          .attr('r', NODE_RADIUS*1.2)
          .attr('fill', 'steelblue')
          .attr('stroke', 'black')
          .attr('stroke-width', '2');
        } else if (dragging && draggedNode === d) {
          console.log('NO CLICKED');
          setDragging(false);
          setDraggedNode(null);
          d3.select(event.target.parentNode)
            .classed('dragged', false);
          
          d3.select(event.target)
            .attr('r', NODE_RADIUS)
            .attr('fill', 'lightblue')
            .attr('stroke', 'black')
            .attr('stroke-width', '2');
        }
      });
    if (dragging) 
    svg.on('mousemove', (event_) => {
      if (dragging && draggedNode !== null) {
        const x = event_.clientX;
        const y = event_.clientY;
        if (draggedNode.point) {
          draggedNode.point.SetX(draggedNode, x);
          draggedNode.point.SetY(draggedNode, y);
        }
        if (animationFrameId === null) {
          animationFrameId = requestAnimationFrame(() => {
            d3.selectAll('.dragged')
              .attr('transform', `translate(${x}, ${y})`);
    
            // Update edges position
            const edgeGroups = svg.selectAll<SVGGElement, Interface.EdgeFx>('g.edge');
            edgeGroups.selectAll<SVGLineElement, Interface.EdgeFx>('line')
              .filter((e) => e.start === draggedNode || e.end === draggedNode)
              .attr('x1', (e) => {
                return e.start.point?.GetX(e.start);
              })
              .attr('y1', (e) => {
                return e.start.point?.GetY(e.start);
              })
              .attr('x2', (e) => {
                return e.end.point?.GetX(e.end);
              })
              .attr('y2', (e) => {
                return e.end.point?.GetY(e.end);
              });
    
                edgeGroups.selectAll<SVGCircleElement, Interface.EdgeFx>('rect')
                  .filter((e) => e.start === draggedNode || e.end === draggedNode)
                  .classed('draggedEdge', true)
                  .attr("x", (e) => (e.start.point?.GetX(e.start) + e.end.point?.GetX(e.end) - rxSize(e.weight)) / 2)
                  .attr("y", (e) => (e.start.point?.GetY(e.start) + e.end.point?.GetY(e.end) - TEXT_EDGE_HEIGHT) / 2)
    
    
                edgeGroups.selectAll<SVGTextElement, Interface.EdgeFx>('text')
                  .filter((e) => e.start === draggedNode || e.end === draggedNode)
                  .attr('x', (e) => (e.start.point?.GetX(e.start) + e.end.point?.GetX(e.end)) / 2)
                  .attr('y', (e) => (e.start.point?.GetY(e.start) + e.end.point?.GetY(e.end)) / 2 + TEXT_Y_EDGE_OFFSET);
                
            animationFrameId = null;
          });
        }
      }
    }); 
    else svg.on('mousemove', null); 
  }
}, [nodes, dragging, draggedNode]);

return <svg style={{ userSelect: "none" }} ref={svgRef} width={SVG_WIDTH} height={SVG_HEIGHT} />;
};

export default DrawGraph;