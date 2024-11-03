import React, { useRef, useEffect } from "react";
import * as Interface from "../interface/graphFx"
import * as d3 from 'd3';
import { SetX, SetY } from '../additional/additional'

const DrawGraph: React.FC<{graph: Interface.GraphFx}> = ({graph}) => {
    const nodes = graph.nodeList;
    const edges = nodes.reduce((acc: Interface.EdgeFx[], node) => acc.concat(node.out), []);  
  
    const svgRef = useRef(null);

  useEffect(() => {
    if (svgRef.current) {
      const svg = d3.select(svgRef.current);

      // Добавление узлов
      const nodeGroups = svg.selectAll('g.node')
        .data(nodes)
        .enter()
        .append('g')
        .attr('class', 'node');

      nodeGroups.append('circle')
        .attr('cx', d => SetX(d))
        .attr('cy', d => SetY(d))
        .attr('r', 20)
        .attr('fill', 'lightblue')
        .attr('stroke', 'black');

      nodeGroups.append('text')
        .attr('x', d => SetX(d) + 20)
        .attr('y', d => SetY(d) - 20)
        .attr('text-anchor', 'left')
        .attr('fill', 'black')
        .text(d => d.name);

      // Добавление ребер
      const edgeGroups = svg.selectAll('g.edge')
        .data(edges)
        .enter()
        .append('g')
        .attr('class', 'edge');

      edgeGroups.append('line')
        .attr('x1', d => SetX(d.start))
        .attr('y1', d => SetY(d.start))
        .attr('x2', d => SetX(d.end))
        .attr('y2', d => SetY(d.end))
        .attr('stroke', 'black');

    }
  }, [nodes, edges]);

  return (
    <svg ref={svgRef} width={800} height={600} />
  );
  };

export default DrawGraph;
