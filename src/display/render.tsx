
import * as constant from "./constant";
import * as Interface from "../interface/graphFx";
import * as d3 from 'd3';
import { EdgeStyle, EdgeStyleKey } from "../styles/edgeStyle";
import { calcCenterPoint } from "./coords";
import { getLinePath } from "./getLinePath";
import { rxSize } from "../additional/additional";
import { NodeStyle, NodeStyleKey } from "../styles/nodeStyle";


function renderNodes(svgRef: React.RefObject<SVGSVGElement>, graph: Interface.GraphFx) {
  if (svgRef.current) {
      console.log('\tNODES\n');
      // console.log('\t', graph.nodeList);
      // console.log('\t', edges);
      // console.log('\tRENDER\n');
      const svg = d3.select(svgRef.current);

        
      // Render Nodes
      const nodeGroups = svg.selectAll<SVGGElement, Interface.NodeFx>('g.node')
        .data(graph.nodeList)
        .enter()
        .append('g')
        .attr('class', 'node')
        .attr('transform', (d) => `translate(${d.point?.GetX(d)}, ${d.point?.GetY(d)})`);

      nodeGroups.append('circle')
        .attr('r', constant.NODE_RADIUS)
        .attr('stroke', (e) => NodeStyle[e.style]['stroke'])
        .attr('stroke-width', (e) => NodeStyle[e.style]['stroke-width'])
        .attr('stroke-dasharray', (e) => NodeStyle[e.style]['stroke-dasharray'])
        .attr('fill', (e) => NodeStyle[e.style]['fill']);

      //TODO андрей предложил расчитывать положение подписи через центр svg посмотри в вк
      nodeGroups.append('rect')
        .attr('x', constant.NODE_RADIUS + constant.TEXT_NODE_OFFSET - constant.TEXT_NODE_WIDTH / 2)
        .attr('y', -constant.NODE_RADIUS - constant.TEXT_NODE_HEIGHT - constant.TEXT_NODE_OFFSET)
        .attr("width", constant.TEXT_NODE_WIDTH)
        .attr("height", constant.TEXT_NODE_HEIGHT + 4)
        .attr('stroke', (d) => NodeStyle[d.style]['stroke-rect'])
        .attr('stroke-width', '0.2')
        .attr('rx', constant.TEXT_RADIUS)
        .attr('ry', constant.TEXT_RADIUS)
        .attr('opacity', 0.9)
        .attr('fill', (d) => NodeStyle[d.style]['fill-rect']);

      nodeGroups.append('text')
        .attr('x', constant.NODE_RADIUS + constant.TEXT_NODE_OFFSET)
        .attr('y', -constant.NODE_RADIUS - constant.TEXT_NODE_OFFSET)
        .attr('font-size', `${constant.TEXT_NODE_HEIGHT}px`)
        .attr('text-anchor', 'middle')
        .attr('fill', 'black')
        .attr('font-weight', (d) => NodeStyle[d.style]['font-weight'])
        .text((d) => d.name);
    }
  }

function renderEdges(svgRef: React.RefObject<SVGSVGElement>, edges: Interface.EdgeFx[], isDirected: boolean) {
  if (svgRef.current) {
    console.log('\tEDGES: ', edges, '\n');
  const svg = d3.select(svgRef.current);

    // Render Edges
    const edgeGroups = svg.selectAll<SVGGElement, Interface.EdgeFx>('g.edge')
      .data(edges)
      .enter()
      .append('g')
      .attr('class', 'edge');
      

      
  edgeGroups.append('path')
  .attr('stroke', (d) => EdgeStyle[d.style]['stroke'])
  .attr('stroke-width', (d) => EdgeStyle[d.style]['stroke-width'])
  .attr('fill', (d) => EdgeStyle[d.style]['fill'])
  .attr('d', (d) => getLinePath(d, isDirected, constant.CURVE_OFFSET, constant.NODE_RADIUS))
  .attr('marker-end', 'url(#arrow)');


    edgeGroups.append('rect')
    .attr("x", (e) => (calcCenterPoint(e, isDirected, constant.CURVE_OFFSET, constant.NODE_RADIUS)[0] - rxSize(e.weight) / 2))
    .attr("y", (e) => (calcCenterPoint(e, isDirected, constant.CURVE_OFFSET, constant.NODE_RADIUS)[1] - constant.TEXT_EDGE_HEIGHT / 2))
      .attr("width", (e) => (rxSize(e.weight)))
      .attr("height", constant.TEXT_EDGE_HEIGHT)
      .attr('stroke', 'gray')
      .attr('stroke-width', '0.2')
      .attr('rx', constant.TEXT_RADIUS)
      .attr('ry', constant.TEXT_RADIUS)
      .attr('opacity', 0.9)
      .attr('fill', (e) => EdgeStyle[e.style]['fill-rect']);

    edgeGroups.append('text')
      .attr('x', (e) => calcCenterPoint(e, isDirected, constant.CURVE_OFFSET, constant.NODE_RADIUS)[0])
      .attr('y', (e) => calcCenterPoint(e, isDirected, constant.CURVE_OFFSET, constant.NODE_RADIUS)[1] + constant.TEXT_Y_EDGE_OFFSET)
      .attr('text-anchor', 'middle')
      .attr('fill', 'black')
      .attr('font-size', `${constant.TEXT_EDGE_HEIGHT}px`)
      .attr('font-weight', (e) => EdgeStyle[e.style]['font-weight'])
      .text((e) => e.weight);
      

      svg.selectAll<SVGGElement, Interface.NodeFx>('g.node').raise();
    }
}


  export { renderNodes, renderEdges }