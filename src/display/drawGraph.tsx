import React, { useRef, useEffect, useState } from "react";
import * as Interface from "../interface/graphFx";
import * as d3 from 'd3';
import { rxSize, getEdges } from "../additional/additional";
import { calcMiddlePoint, calcCenterPoint } from "./coords";
import { getLinePath } from "./getLinePath";

const NODE_RADIUS = 20;

const TEXT_RADIUS= 7;
const TEXT_NODE_HEIGHT = 18;
const TEXT_NODE_OFFSET = 8;
const TEXT_NODE_WIDTH = 70;
const CURVE_OFFSET = 50;

const TEXT_EDGE_HEIGHT = 18;
const TEXT_Y_EDGE_OFFSET = TEXT_EDGE_HEIGHT / 2 - 2; //-2 потому что высота тыры пыры смещение все дела



const DrawGraph: React.FC<{ graph: Interface.GraphFx, width : number, height: number }> = ({ graph, width, height }) => {
  const SVG_WIDTH = width;
  const SVG_HEIGHT = height;
  const [edges, setEdges] = useState<Interface.EdgeFx[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);
  const isDirected = graph.isDirected();
  
  if (!d3.select(svgRef.current).select('defs').node() && isDirected) {
    console.log('\tADD MARKER');
    const marker = d3.select(svgRef.current).append('defs')
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
    console.log('\tCALCULATE\n');
    d3.select(svgRef.current).selectAll('*').remove();
    graph.calcCoordinates(SVG_WIDTH, SVG_HEIGHT);
    setEdges(graph.nodeList.reduce((acc: Interface.EdgeFx[], node) => acc.concat(node.out), []));
  }, [graph]);


  useEffect(() => {
    if (svgRef.current) {
      console.log('\tEDGES\n');
    const svg = d3.select(svgRef.current);

      // Render Edges
      const edgeGroups = svg.selectAll<SVGGElement, Interface.EdgeFx>('g.edge')
        .data(edges)
        .enter()
        .append('g')
        .attr('class', 'edge');
        

        
    edgeGroups.append('path')
    .attr('stroke', 'black')
    .attr('stroke-width', '2')
    .attr('fill', 'none')
    .attr('d', (d) => getLinePath(d, isDirected, CURVE_OFFSET, NODE_RADIUS))
    .attr('marker-end', 'url(#arrow)');


      edgeGroups.append('rect')
      .attr("x", (e) => (calcCenterPoint(e, isDirected, CURVE_OFFSET, NODE_RADIUS)[0] - rxSize(e.weight) / 2))
      .attr("y", (e) => (calcCenterPoint(e, isDirected, CURVE_OFFSET, NODE_RADIUS)[1] - TEXT_EDGE_HEIGHT / 2))
        .attr("width", (e) => (rxSize(e.weight)))
        .attr("height", TEXT_EDGE_HEIGHT)
        .attr('stroke', 'gray')
        .attr('stroke-width', '0.2')
        .attr('rx', TEXT_RADIUS)
        .attr('ry', TEXT_RADIUS)
        .attr('opacity', 0.9)
        .attr('fill', '#F7F7F7');

      edgeGroups.append('text')
        .attr('x', (e) => calcCenterPoint(e, isDirected, CURVE_OFFSET, NODE_RADIUS)[0])
        .attr('y', (e) => calcCenterPoint(e, isDirected, CURVE_OFFSET, NODE_RADIUS)[1] + TEXT_Y_EDGE_OFFSET)
        .attr('text-anchor', 'middle')
        .attr('fill', 'black')
        .attr('font-size', `${TEXT_EDGE_HEIGHT}px`)
        .text((e) => e.weight);
        

        svg.selectAll<SVGGElement, Interface.NodeFx>('g.node').raise();
      }
  }, [edges]);

  useEffect(() => {
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
  }, [graph.nodeList]);




const [draggedNode, setDraggedNode] = useState<Interface.NodeFx | null>(null);

useEffect(() => {
  //console.log('4st\n');
  if (svgRef.current) {
    console.log('\tDRAG\n');
    const svg = d3.select(svgRef.current);

    let animationFrameId: number | null = null;

    svg.selectAll<SVGGElement, Interface.NodeFx>('g.node')
      .on('click', (event, d) => {
        //TODO вот тут прикол какой то происходит, см баг при перемешении где то в TODO было
        console.log('CLICK: ', draggedNode?.name, d.name);
        if (draggedNode === null) {
          console.log('CLICKED');
          setDraggedNode(d);
          d3.select(event.target.parentNode)
            .classed('dragged', true)
            .raise();
          d3.select(event.target)
          .attr('r', NODE_RADIUS*1.2)
          .attr('fill', 'steelblue')
          .attr('stroke', 'black')
          .attr('stroke-width', '2');
        } else if (draggedNode === d) {
          console.log('NO CLICKED');
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
    if (draggedNode !== null) 
    svg.on('mousemove', (event_) => {
      if (draggedNode !== null) {
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
            edgeGroups.selectAll<SVGPathElement, Interface.EdgeFx>('path')
              .filter((e) => e.start === draggedNode || e.end === draggedNode)
              .attr('d', (e) => getLinePath(e, isDirected, CURVE_OFFSET, NODE_RADIUS));
              // .attr('x1', (e) => {
              //   return e.start.point?.GetX(e.start);
              // })
              // .attr('y1', (e) => {
              //   return e.start.point?.GetY(e.start);
              // })
              // .attr('x2', (e) => {
              //   return e.end.point?.GetX(e.end);
              // })
              // .attr('y2', (e) => {
              //   return e.end.point?.GetY(e.end);
              // });
    
                edgeGroups.selectAll<SVGCircleElement, Interface.EdgeFx>('rect')
                  .filter((e) => e.start === draggedNode || e.end === draggedNode)
                  .attr("x", (e) => (calcCenterPoint(e, isDirected, CURVE_OFFSET, NODE_RADIUS)[0] - rxSize(e.weight) / 2))
                  .attr("y", (e) => (calcCenterPoint(e, isDirected, CURVE_OFFSET, NODE_RADIUS)[1] - TEXT_EDGE_HEIGHT / 2))
    
    
                edgeGroups.selectAll<SVGTextElement, Interface.EdgeFx>('text')
                  .filter((e) => e.start === draggedNode || e.end === draggedNode)
                  .attr('x', (e) => calcCenterPoint(e, isDirected, CURVE_OFFSET, NODE_RADIUS)[0])
                  .attr('y', (e) => calcCenterPoint(e, isDirected, CURVE_OFFSET, NODE_RADIUS)[1] + TEXT_Y_EDGE_OFFSET);
                
            animationFrameId = null;
          });
        }
      }
    }); 
    else svg.on('mousemove', null); 
  }
}, [graph.nodeList, draggedNode]);

return <svg style={{ userSelect: "none" }} ref={svgRef} width={SVG_WIDTH} height={SVG_HEIGHT} />;
};

export default DrawGraph;