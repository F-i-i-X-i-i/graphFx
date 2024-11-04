import React, { useRef, useEffect, useState } from "react";
import * as Interface from "../interface/graphFx";
import * as d3 from 'd3';

const NODE_RADIUS = 20;
const SVG_WIDTH = 800;
const SVG_HEIGHT = 600;

const DrawGraph: React.FC<{ graph: Interface.GraphFx }> = ({ graph }) => {
  const [nodes, setNodes] = useState<Interface.NodeFx[]>([]);
  const edges = nodes.reduce((acc: Interface.EdgeFx[], node) => acc.concat(node.out), []);

  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    console.log('o gore 1')
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

      return nodeList
    }
    setNodes(calcCoordinates(graph));
  }, [graph]);

  useEffect(() => {
    if (svgRef.current) {
      console.log('o gore 2')
      const svg = d3.select(svgRef.current);
      svg.selectAll("*").remove();

      const drag = d3.drag<SVGGElement, Interface.NodeFx>()
        .on('start', (event, d) => {
          d3.select(event.sourceEvent.target).raise();
        })
        .on('drag', (event, d) => {
          const x = d3.pointer(event)[0];
          const y = d3.pointer(event)[1];
          
          d.point?.SetX(d, x)
          d.point?.SetY(d, y)
          
          // Update node position
          d3.select(event.sourceEvent.target.parentNode)
            .attr('transform', `translate(${x}, ${y})`);

          // Update edges position
          svg.selectAll<SVGLineElement, Interface.EdgeFx>('line')
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
        });

      // Render Nodes
      const nodeGroups = svg.selectAll<SVGGElement, Interface.NodeFx>('g.node')
        .data(nodes)
        .enter()
        .append('g')
        .attr('class', 'node')
        .attr('transform', (d) => `translate(${d.point?.GetX(d)}, ${d.point?.GetY(d)})`)
        .call(drag);

      nodeGroups.append('circle')
        .attr('r', NODE_RADIUS)
        .attr('fill', 'lightblue')
        .attr('stroke', 'black');

      nodeGroups.append('text')
        .attr('x', NODE_RADIUS)
        .attr('y', -NODE_RADIUS)
        .attr('text-anchor', 'middle')
        .attr('fill', 'black')
        .text((d) => d.name);

      // Render Edges
      const edgeGroups = svg.selectAll<SVGGElement, Interface.EdgeFx>('g.edge')
        .data(edges)
        .enter()
        .append('g')
        .attr('class', 'edge');

      edgeGroups.append('line')
        .attr('stroke', 'black');

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
  }, [nodes, edges]);

  return <svg ref={svgRef} width={SVG_WIDTH} height={SVG_HEIGHT} />;
};

export default DrawGraph;