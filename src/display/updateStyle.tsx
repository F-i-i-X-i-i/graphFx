
import * as constant from "./constant";
import * as Interface from "../interface/graphFx";
import * as d3 from 'd3';
import { EdgeStyle, EdgeStyleKey } from "../styles/edgeStyle";
import { NodeStyle, NodeStyleKey } from "../styles/nodeStyle";
import { groupColors } from "../styles/groupColors";


function resetNodesStyle(svgRef: React.RefObject<SVGSVGElement>, nodes: Interface.NodeFx[]) {
  if (svgRef.current) {
    for (let i = 0; i <nodes.length; ++i) 
        nodes[i].style = NodeStyleKey.DEFAULT;
  }
  updateNodesStyle(svgRef, nodes);
}


function resetEdgesStyle(svgRef: React.RefObject<SVGSVGElement>, edges: Interface.EdgeFx[], isDirected: boolean) {
  if (svgRef.current) {
    for (let i = 0; i <edges.length; ++i) 
      edges[i].style = EdgeStyleKey.DEFAULT;
  }
  updateEdgesStyle(svgRef, edges, isDirected);
}


function updateNodesStyle(svgRef: React.RefObject<SVGSVGElement>, nodes: Interface.NodeFx[]) {
  
  if (svgRef.current) {
    const svg = d3.select(svgRef.current);
    const nodeGroups = svg.selectAll<SVGGElement, Interface.NodeFx>('g.node');
    nodeGroups.selectAll<SVGCircleElement, Interface.NodeFx>('circle')
      .attr('stroke', (e) => NodeStyle[e.style]['stroke'])
      .attr('stroke-width', (e) => NodeStyle[e.style]['stroke-width'])
      .attr('stroke-dasharray', (e) => NodeStyle[e.style]['stroke-dasharray'])
      .attr('fill', (e) => ((e.style === NodeStyleKey.GROUP && e.group) ? groupColors[e.group % groupColors.length] : NodeStyle[e.style]['fill']));
    
      nodeGroups.selectAll<SVGTextElement, Interface.NodeFx>('text')
      .attr('font-weight', (d) => NodeStyle[d.style]['font-weight']);

      nodeGroups.selectAll<SVGCircleElement, Interface.NodeFx>('rect')
      .attr('fill', (d) => NodeStyle[d.style]['fill-rect'])
      .attr('stroke', (d) => NodeStyle[d.style]['stroke-rect'])
    }
  }

function updateEdgesStyle(svgRef: React.RefObject<SVGSVGElement>, edges: Interface.EdgeFx[], isDirected: boolean) {
  if (svgRef.current) {
    const svg = d3.select(svgRef.current);
    const edgeGroups = svg.selectAll<SVGGElement, Interface.EdgeFx>('g.edge');
    edgeGroups.selectAll<SVGPathElement, Interface.EdgeFx>('path')
      .attr('stroke', (d) => EdgeStyle[d.style]['stroke'])
      .attr('stroke-width', (d) => EdgeStyle[d.style]['stroke-width'])
      .attr('stroke-dasharray', (d) => EdgeStyle[d.style]['stroke-dasharray'])
      .attr('fill', (d) => EdgeStyle[d.style]['fill']);
      edgeGroups.selectAll<SVGTextElement, Interface.EdgeFx>('text')
      .attr('font-weight', (d) => EdgeStyle[d.style]['font-weight']);
      edgeGroups.selectAll<SVGRectElement, Interface.EdgeFx>('rect')
      .attr('stroke', (d) => EdgeStyle[d.style]['stroke-rect'])
      .attr('fill', (d) => EdgeStyle[d.style]['fill-rect']);
  }
    
}


  export { updateNodesStyle, updateEdgesStyle, resetNodesStyle, resetEdgesStyle }