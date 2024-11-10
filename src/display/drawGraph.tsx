import React, { useRef, useEffect, useState } from "react";
import * as Interface from "../interface/graphFx";
import * as d3 from 'd3';
import { coordsOnBorder, isNodeTooClose } from "../additional/additional";

const NODE_RADIUS = 20;
const SVG_WIDTH = 800;
const SVG_HEIGHT = 600;

const DrawGraph: React.FC<{ graph: Interface.GraphFx }> = ({ graph }) => {
  const [nodes, setNodes] = useState<Interface.NodeFx[]>([]);
  const edges = nodes.reduce((acc: Interface.EdgeFx[], node) => acc.concat(node.out), []);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const calcCoordinates = (graph : Interface.GraphFx) : Interface.NodeFx[] => {
      const nodeList = graph.nodeList;
      const radius = 200; // радиус окружности
      const centerX = 400; // координата x центра окружности
      const centerY = 300; // координата y центра окружности

      for (let i = 0; i < nodeList.length; i++) {
        const angle = (2 * Math.PI * i) / nodeList.length; // угол для текущей вершины
        const x = centerX + radius * Math.cos(angle); // координата x текущей вершины
        const y = centerY + radius * Math.sin(angle); // координата y текущей вершины
        nodeList[i].point = { 
          x: x, 
          y: y,
          SetX: (d : Interface.NodeFx, x : number) => {
            if (d.point) {
              d.point.x = coordsOnBorder(x, SVG_WIDTH);
              setNodes(nodes.map((node) => (node === d ? { ...node, point: { ...node.point, x } } : node) as Interface.NodeFx));
            }},
          SetY: (d : Interface.NodeFx, y : number) => {
            if (d.point) {
              d.point.y = coordsOnBorder(y, SVG_HEIGHT);
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
    if (svgRef.current) {
      const svg = d3.select(svgRef.current);

      // Render Edges
      const edgeGroups = svg.selectAll<SVGGElement, Interface.EdgeFx>('g.edge')
        .data(edges)
        .enter()
        .append('g')
        .attr('class', 'edge');
        
      edgeGroups.append('line')
        .attr('stroke', 'black')
        .attr('stroke-width', '2');

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

      nodeGroups.append('text')
        .attr('x', NODE_RADIUS)
        .attr('y', -NODE_RADIUS)
        .attr('text-anchor', 'middle')
        .attr('fill', 'black')
        .text((d) => d.name);
    }
  }, [nodes]);


  useEffect(() => {
    if (svgRef.current) {
      const svg = d3.select(svgRef.current);
      const drag = d3.drag<SVGGElement, Interface.NodeFx>()
        .on('start', (event, d) => {
          console.log(d.name);
          if (!d3.selectAll('.target').empty()) {
            console.log('O NEEET TI NE PROUDESH')
            return;
          }
          //console.log(nodes);
          d3.select(event.sourceEvent.target.parentNode).raise();
          d3.select(event.sourceEvent.target.parentNode)
            .classed('target', true);
        })
        .on('drag', (event, d) => {
          //console.log(nodes);
            const x = d3.pointer(event)[0];
            const y = d3.pointer(event)[1];          
            //console.log(d.point?.x, d.point?.y, ' -> ', x, y);
            //console.log(isNodeTooClose(nodes, d, x, y, 2*NODE_RADIUS));
            //console.log(nodes);
            if (!isNodeTooClose(nodes, d, x, y, 2*NODE_RADIUS)) {
              d.point?.SetX(d, x);
              d.point?.SetY(d, y);
              d3.select(event.sourceEvent.target.parentNode)
                .attr('transform', `translate(${x}, ${y})`);
            } else 
              console.log('o schastue');
            // Update node position
            // Update edges position
            const edgeGroups = svg.selectAll<SVGGElement, Interface.EdgeFx>('g.edge');
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
        })
        .on('end', (event, d) => {
          d3.select(event.sourceEvent.target.parentNode)
            .classed('target', false);
        });
      svg.selectAll<SVGGElement, Interface.NodeFx>('g.node')
        .call(drag);
    }
  }, [nodes]);



  return <svg ref={svgRef} width={SVG_WIDTH} height={SVG_HEIGHT} />;
};

export default DrawGraph;