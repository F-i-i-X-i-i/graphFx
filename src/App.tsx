import React, { useEffect, useState, useMemo } from 'react';
import './App.css';
import * as Interface from './interface/graphFx';
import { AdjMatrix } from './input/adjMatrix';
import DrawGraph from './display/drawGraph';
import GraphFxAlgs from './processing/algorithms';

function App() {  


    const input = "0 1 1 1 1\n1 0 1 1 1\n1 1 0 1 1\n1 1 1 0 1\n1 1 1 1 0";
    //const input = "0 0\n1 0";
    //const input = "0 1 1\n1 0 1\n1 1 0";
    //const input = "0 1 1 1\n1 0 1 1\n1 1 0 1\n1 1 1 0";
    const graph = useMemo(() => new AdjMatrix(input), [input]);   
    const graphAlg = useMemo(() => new GraphFxAlgs(graph), [graph]);  
  
    const [width, setWidth] = useState(window.innerWidth);
    const [height, setHeight] = useState(window.innerHeight);

    useEffect(() => {
      console.log('APPs\n\n\n\n');
      const handleResize = () => {
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };

    }, []);

  console.log(width, height);
  console.log('APP', graphAlg.graph.nodeList.map(node => node.point));
  return (
    <div className ="field">
      <DrawGraph graph={graphAlg.graph} width = {width * 0.8} height = {height}/>
</div>
  );
}

export default App;
