import React, { useRef, useEffect, useState } from "react";
import * as Interface from "../interface/graphFx";
import * as d3 from 'd3';
import { rxSize, getEdges } from "../additional/additional";
import { calcMiddlePoint, calcCenterPoint } from "./coords";
import { getLinePath } from "./getLinePath";
import { EdgeStyle, EdgeStyleKey } from "../styles/edgeStyle";
import * as constant from "./constant";
import { renderNodes, renderEdges } from "./render";
import { updateEdgesStyle, updateNodesStyle, resetEdgesStyle, resetNodesStyle } from "./updateStyle";
import { isDisabled } from "@testing-library/user-event/dist/utils";
import { NodeStyleKey } from "../styles/nodeStyle";
 //-2 потому что высота тыры пыры смещение все дела



const DrawGraph: React.FC<{ trigg: number, graph: Interface.GraphFx, width : number, height: number }> = ({ trigg, graph, width, height }) => {
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
    updateEdgesStyle(svgRef, edges, isDirected);
    updateNodesStyle(svgRef, graph.nodeList);
  }, [trigg]);

  useEffect(() => {
    console.log('\tCALCULATE\n');
    d3.select(svgRef.current).selectAll('*').remove();
    setEdges(graph.nodeList.reduce((acc: Interface.EdgeFx[], node) => acc.concat(node.out), []));
    graph.calcCoordinates(SVG_WIDTH, SVG_HEIGHT);
  }, [graph]);


  useEffect(() => {
    renderEdges(svgRef, edges, isDirected);
  }, [edges]);

  useEffect(() => {
    renderNodes(svgRef, graph);
  }, [graph.nodeList]);



const [draggedNode, setDraggedNode] = useState<Interface.NodeFx | null>(null);

useEffect(() => {
  console.log('4st\n');
  if (svgRef.current) {
    console.log('\tDRAG\n');
    const svg = d3.select(svgRef.current);

    let animationFrameId: number | null = null;

    svg.selectAll<SVGGElement, Interface.NodeFx>('g.node').select('circle')
      .on('click', (event, d) => {
        resetEdgesStyle(svgRef, edges, isDirected);
        resetNodesStyle(svgRef, graph.nodeList);
        //TODO вот тут прикол какой то происходит, см баг при перемешении где то в TODO было
        console.log('CLICK: ', draggedNode?.name, d.name);
        if (draggedNode === null) {
          console.log('CLICKED');
          setDraggedNode(d);
          d.style = NodeStyleKey.DRAGGING;

          d3.select(event.target.parentNode)
            .classed('dragged', true)
            .raise();
          d3.select(event.target)
          .attr('r', constant.NODE_RADIUS*1.2);

          for (let i = 0; i < edges.length; ++i)
            if (edges[i].start === d || edges[i].end === d) {
              edges[i].style = EdgeStyleKey.DRAGGING;
              console.log('\t\tЯ РОДИЛСЯ\n\n\n');
            }
        } else if (draggedNode === d) {
          console.log('NO CLICKED');
          setDraggedNode(null);
          d.style = NodeStyleKey.DEFAULT;
          d3.select(event.target.parentNode)
            .classed('dragged', false);
          
          d3.select(event.target)
            .attr('r', constant.NODE_RADIUS)
            
          for (let i = 0; i < edges.length; ++i)
              edges[i].style = EdgeStyleKey.DEFAULT;
        }

        updateEdgesStyle(svgRef, edges, isDirected);
        updateNodesStyle(svgRef, graph.nodeList);
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
              .attr('d', (e) => getLinePath(e, isDirected, constant.CURVE_OFFSET, constant.NODE_RADIUS));
    
                edgeGroups.selectAll<SVGCircleElement, Interface.EdgeFx>('rect')
                  .filter((e) => e.start === draggedNode || e.end === draggedNode)
                  .attr("x", (e) => (calcCenterPoint(e, isDirected, constant.CURVE_OFFSET, constant.NODE_RADIUS)[0] - rxSize(e.weight) / 2))
                  .attr("y", (e) => (calcCenterPoint(e, isDirected, constant.CURVE_OFFSET, constant.NODE_RADIUS)[1] - constant.TEXT_EDGE_HEIGHT / 2))
    
    
                edgeGroups.selectAll<SVGForeignObjectElement, Interface.EdgeFx>('ForeignObject')
                  .filter((e) => e.start === draggedNode || e.end === draggedNode)
                  .attr("x", (e) => (calcCenterPoint(e, isDirected, constant.CURVE_OFFSET, constant.NODE_RADIUS)[0] - rxSize(e.weight) / 2))
                  .attr("y", (e) => (calcCenterPoint(e, isDirected, constant.CURVE_OFFSET, constant.NODE_RADIUS)[1] - constant.TEXT_EDGE_HEIGHT / 2))
                
            animationFrameId = null;
          });
        }
      }
    }); 
    else svg.on('mousemove', null); 
  }
}, [graph.nodeList, edges, draggedNode]);

return <svg style={{ userSelect: "none" }} ref={svgRef} width={SVG_WIDTH} height={SVG_HEIGHT} />;
};

export default DrawGraph;