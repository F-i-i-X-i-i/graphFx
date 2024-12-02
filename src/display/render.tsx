
import * as constant from "./constant";
import * as Interface from "../interface/graphFx";
import * as d3 from 'd3';
import { EdgeStyle, EdgeStyleKey } from "../styles/edgeStyle";
import { calcCenterPoint } from "./coords";
import { getLinePath } from "./getLinePath";
import { rxSize } from "../additional/additional";
import { NodeStyle, NodeStyleKey } from "../styles/nodeStyle";
import { checkWeight, uniqName } from "../additional/checkRedact";


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
        .attr('x', (d) => constant.NODE_RADIUS + constant.TEXT_NODE_OFFSET - rxSize(d.name) / 2)
        .attr('y', -constant.NODE_RADIUS - constant.TEXT_NODE_HEIGHT - constant.TEXT_NODE_OFFSET)
        .attr("width", (d) => rxSize(d.name))
        .attr("height", constant.TEXT_NODE_HEIGHT + 4)
        .attr('stroke', (d) => NodeStyle[d.style]['stroke-rect'])
        .attr('stroke-width', '0.2')
        .attr('rx', constant.TEXT_RADIUS)
        .attr('ry', constant.TEXT_RADIUS)
        .attr('opacity', 0.9)
        .attr('fill', (d) => NodeStyle[d.style]['fill-rect']);



        nodeGroups.append('foreignObject')
  .attr('x', (d) => constant.NODE_RADIUS + constant.TEXT_NODE_OFFSET - rxSize(d.name) / 2)
  .attr('y', -constant.NODE_RADIUS - constant.TEXT_NODE_HEIGHT - constant.TEXT_NODE_OFFSET)
  .attr('width', (d) => rxSize(d.name))
  .attr('height', constant.TEXT_NODE_HEIGHT + 4)
  .append('xhtml:div')
  .attr('contentEditable', 'true')
  .attr('style', (e) => `font-size: 14px; text-align: center; font-weight: ${NodeStyle[e.style]['font-weight']}`)
  .text((d) => d.name)
  .on('blur', (event, d) => {
    d.name  = uniqName(event.target.textContent, d, graph.nodeList);
    event.target.textContent = d.name;
    // обновляем данные
    console.log(d);
    let rect = event.target.parentNode.parentNode.querySelector('rect');
    let forObj = event.target.parentNode;
    rect.style.width = rxSize(d.name);
    forObj.style.width = rxSize(d.name);
    rect.setAttribute("x", constant.NODE_RADIUS + constant.TEXT_NODE_OFFSET - rxSize(d.name) / 2);
    rect.setAttribute("y", -constant.NODE_RADIUS - constant.TEXT_NODE_HEIGHT - constant.TEXT_NODE_OFFSET);
    forObj.setAttribute("x", constant.NODE_RADIUS + constant.TEXT_NODE_OFFSET - rxSize(d.name) / 2);
    forObj.setAttribute("y", -constant.NODE_RADIUS - constant.TEXT_NODE_HEIGHT - constant.TEXT_NODE_OFFSET);



  });
  //     nodeGroups.append('text')
  //       .attr('x', constant.NODE_RADIUS + constant.TEXT_NODE_OFFSET)
  //       .attr('y', -constant.NODE_RADIUS - constant.TEXT_NODE_OFFSET)
  //       .attr('font-size', `${constant.TEXT_NODE_HEIGHT}px`)
  //       .attr('text-anchor', 'middle')
  //       .attr('fill', 'black')
  //       .attr('font-weight', (d) => NodeStyle[d.style]['font-weight'])
  //       .text((d) => d.name);

      nodeGroups.append('text')
        .classed('inCircle', true)
        .attr('x', '0')
        .attr('y', '9')
        .attr('font-size', '30px')
        .attr('text-anchor', 'middle')
        .attr('fill', 'black')
        .attr('font-family', 'Menlo')
        .attr('font-weight', 'bold')
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
      .attr("height", constant.TEXT_EDGE_HEIGHT + 4)
      .attr('stroke', 'gray')
      .attr('stroke-width', '0.2')
      .attr('rx', constant.TEXT_RADIUS)
      .attr('ry', constant.TEXT_RADIUS)
      .attr('opacity', 0.9)
      .attr('fill', (e) => EdgeStyle[e.style]['fill-rect']);

    edgeGroups.append('foreignObject')
    .attr("x", (e) => (calcCenterPoint(e, isDirected, constant.CURVE_OFFSET, constant.NODE_RADIUS)[0] - rxSize(e.weight) / 2))
    .attr("y", (e) => (calcCenterPoint(e, isDirected, constant.CURVE_OFFSET, constant.NODE_RADIUS)[1] - constant.TEXT_EDGE_HEIGHT / 2))
      .attr("width", (e) => (rxSize(e.weight)))
      .attr("height", constant.TEXT_EDGE_HEIGHT + 4)
      .append('xhtml:div')
      .attr('contentEditable', 'true')
      .attr('style', (e) => `font-size: 14px; text-align: center; font-weight: ${EdgeStyle[e.style]['font-weight']}`)
      .text((d) => d.weight)
      .on('blur', (event, d) => {
        let reverseEdge = edges.find(edge => edge.start === d.end && edge.end === d.start);
        if (checkWeight(event.target.textContent)) {
          if (reverseEdge)
            reverseEdge.weight = parseInt(event.target.textContent);  
          d.weight = parseInt(event.target.textContent);
        }
        event.target.textContent = d.weight;
        let rect = event.target.parentNode.parentNode.querySelector('rect');
        let forObj = event.target.parentNode;
        rect.style.width = rxSize(d.weight);
        forObj.style.width = rxSize(d.weight);
        rect.setAttribute("x", calcCenterPoint(d, isDirected, constant.CURVE_OFFSET, constant.NODE_RADIUS)[0] - rxSize(d.weight) / 2);
        rect.setAttribute("y", calcCenterPoint(d, isDirected, constant.CURVE_OFFSET, constant.NODE_RADIUS)[1] - constant.TEXT_EDGE_HEIGHT / 2);
        forObj.setAttribute("x", calcCenterPoint(d, isDirected, constant.CURVE_OFFSET, constant.NODE_RADIUS)[0] - rxSize(d.weight) / 2);
        forObj.setAttribute("y", calcCenterPoint(d, isDirected, constant.CURVE_OFFSET, constant.NODE_RADIUS)[1] - constant.TEXT_EDGE_HEIGHT / 2);

        //event.target.style.width = rxSize(d.weight);
        
        // обновляем данные
        console.log(d);
      });

      

      svg.selectAll<SVGGElement, Interface.NodeFx>('g.node').raise();
    }
}


  export { renderNodes, renderEdges }