import React from 'react';
import './App.css';
import * as Interface from './interface/graphFx';
import { AdjMatrix } from './input/adjMatrix';
import DrawGraph from './display/drawGraph';

function App() {  
  const input = "";
  const graph: Interface.GraphFx = new AdjMatrix(input);
  for (let i = 0; i < graph.nodeList.length; i++) {
    console.log(graph.nodeList[i].name);
    for (let j = 0; j < graph.nodeList[i].in.length; j++) 
      console.log('\t', graph.nodeList[i].in[j].end.name);
    console.log('\n');
    for (let j = 0; j < graph.nodeList[i].out.length; j++) 
      console.log('\t', graph.nodeList[i].out[j].end.name);


  }
  return (
    <div>
      <DrawGraph graph={graph} />
</div>
  );
}

export default App;
