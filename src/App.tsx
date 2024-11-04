import React from 'react';
import './App.css';
import * as Interface from './interface/graphFx';
import { AdjMatrix } from './input/adjMatrix';
import DrawGraph from './display/drawGraph';
import GraphFxAlgs from './processing/algorithms';

function App() {  
  //const input = "0 1 1 1 1\n1 0 1 1 1\n1 1 0 1 1\n1 1 1 0 1\n1 1 1 1 0";
  //const input = "0 0\n1 0";
  //const input = "0 1 1\n1 0 1\n1 1 0";
  const input = "0 1 1 1\n1 0 1 1\n1 1 0 1\n1 1 1 0";
  const graph: Interface.GraphFx = new AdjMatrix(input);
  const graphAlg: Interface.GraphFxAlgs = new GraphFxAlgs(graph);

  
  return (
    <div>
      <DrawGraph graph={graphAlg.graph} />
</div>
  );
}

export default App;
