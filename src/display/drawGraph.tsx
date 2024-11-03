import React from "react";
import * as Interface from "../interface/graphFx"

const DrawGraph: React.FC<{graph: Interface.GraphFx}> = ({graph}) => {
    const nodes = graph.nodeList;
    const edges = nodes.reduce((acc: Interface.EdgeFx[], node) => acc.concat(node.out), []);  
    return (
      <div>
        <svg width="800" height="600">
          {nodes.map((node, index) => (
            <circle
              key={index}
              cx={node.point?.x || 50 + index * 100}
              cy={node.point?.y || 50}
              r="20"
              fill="lightblue"
              stroke="black"
            />
          ))}
          {edges.map((edge, index) => (
            <line
              key={index}
              x1={edge.start.point?.x || 50 + nodes.indexOf(edge.start) * 100}
              y1={edge.start.point?.y || 50}
              x2={edge.end.point?.x || 50 + nodes.indexOf(edge.end) * 100}
              y2={edge.end.point?.y || 50}
              stroke="black"
            />
          ))}
        </svg>
      </div>
    );
};

export default DrawGraph;
