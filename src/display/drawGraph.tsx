import React, { useRef, useEffect, useState } from "react";
import * as Interface from "../interface/graphFx";
import * as d3 from 'd3';
import { coordsOnBorder } from "../additional/additional";

const NODE_RADIUS = 20;

const DrawGraph: React.FC<{ graph: Interface.GraphFx, width : number, height: number }> = ({ graph, width, height }) => {
  const SVG_WIDTH = width;
  const SVG_HEIGHT = height;
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


const [dragging, setDragging] = useState(false);
const [draggedNode, setDraggedNode] = useState<Interface.NodeFx | null>(null);

useEffect(() => {
  if (svgRef.current) {
    const svg = d3.select(svgRef.current);

    svg.selectAll<SVGGElement, Interface.NodeFx>('g.node')
      .on('click', (event, d) => {
        if (!dragging) {
          console.log('click');
          setDragging(true);
          setDraggedNode(d);
          d3.select(event.target.parentNode)
            .classed('dragged', true);
        } else if (dragging && draggedNode === d) {
          console.log('endclick\n');
          setDragging(false);
          setDraggedNode(null);
          d3.select(event.target.parentNode)
            .classed('dragged', false);
        }
      });
      if (dragging) 
        svg.on('mousemove', (event_) => {
          console.log(dragging, draggedNode);
          if (dragging && draggedNode !== null) {
            console.log('\tdragging')
            const x = event_.clientX;
            const y = event_.clientY;
            if (draggedNode.point) {
              draggedNode.point.SetX(draggedNode, x);
              draggedNode.point.SetY(draggedNode, y);
            }
            console.log('o gore: ', d3.selectAll());
            d3.selectAll('.dragged')
              .attr('transform', `translate(${x}, ${y})`);
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
          }
        });
      else svg.on('mousemove', null);
  }
}, [nodes, dragging, draggedNode]);

  return <svg ref={svgRef} width={SVG_WIDTH} height={SVG_HEIGHT} />;
};

export default DrawGraph;