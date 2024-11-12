import React, {useEffect, useMemo, useState} from "react";
import * as Interface from "../interface/graphFx"
import DrawGraph from "../display/drawGraph";
import { AdjMatrix } from "../input/adjMatrix";
import { GraphFxAlgs } from "../processing/algorithms";
import "../css/sidebar.css"

const Mainframe: React.FC<{}> = () => {
    const [currInput, setCurrInput] = useState("");
    const [input, setInput] = useState("");
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

    const handleSendMatrix = () => {
      setInput(currInput);
    };

  console.log(width, height);
  console.log('APP', graphAlg.graph.nodeList.map(node => node.point));
  return (
    <div className="field">
      <DrawGraph graph={graphAlg.graph} width={width * 0.8} height={height} />
      <div className="sidebar">
        <textarea className="Inputmatrix" value={currInput} onChange={(e) => setCurrInput(e.target.value)} placeholder="Введите матрицу смежности" />
        <button onClick={handleSendMatrix}>Отправить</button>
      </div>
    </div>
  );
}

export { Mainframe }