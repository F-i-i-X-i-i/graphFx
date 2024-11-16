import React, {useEffect, useMemo, useState} from "react";
//import * as Interface from "../interface/graphFx"
import DrawGraph from "../display/drawGraph";
import { AdjMatrix } from "../input/adjMatrix";
import { GraphFxAlgs } from "../processing/algorithms";
import * as Interface from "../interface/graphFx";
import "../css/sidebar.css";
import "../css/errorMsg.css";
import { Toast, Button } from 'react-bootstrap';
import { checkMatrix } from "./checkers";
import Form from 'react-bootstrap/Form';


const Mainframe: React.FC<{}> = () => {
    const [currInput, setCurrInput] = useState("");
    const [input, setInput] = useState("");
    const [trigg, setTrigg] = useState(0);
    const graph = useMemo(() => new AdjMatrix(input), [input]);
    const graphAlg = useMemo(() => new GraphFxAlgs(graph), [graph]);

    const [width, setWidth] = useState(window.innerWidth);
    const [height, setHeight] = useState(window.innerHeight);

    const [error, setError] = useState('');
    const [showError, setShowError] = useState(false);


    const closeError = () => {
      setShowError(false);
    };

    useEffect(() => {
      console.log("RESIZE");
      //console.log('APPs\n\n\n\n');
      const handleResize = () => {
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };

    }, []);


    useEffect(() => {
      
    }, [graph]);


    const handleSendMatrix = () => {
      console.log("HANDLE SEND MATRIX\n\n");
      const error = checkMatrix(currInput);
      
      setError(error);
      if (error === '') {
        setShowError(false);
        //console.log(currInput);
        setInput(currInput);
      } else { 
        setShowError(true);
      }
    };


    const [selectedNode1, setSelectedNode1] = useState<string>('');
    const [selectedNode2, setSelectedNode2] = useState<string>('');


    const findPath = () => {
      
      let path = graphAlg.dijkstra(graphAlg.graph.nodeList[parseInt(selectedNode1)], graphAlg.graph.nodeList[parseInt(selectedNode2)]);
      console.log('path: ', path, '\n');
      setTrigg(trigg + 1);
    };
  //console.log(width, height);
  //console.log('APP', graphAlg.graph.nodeList.map(node => node.point));

  //TODO переключатели между вводом матрицы смежности инцидентности и тд
  return (
    <div className="field">
      {showError && (
       <Toast show={showError} onClose={closeError} delay={5000} autohide style={{ position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#f44336', color: '#fff', padding: '10px', borderRadius: '10px'}}>
       <Toast.Header closeButton={true} onClick={closeError}>
         <strong className="me-auto">Ошибка</strong>
       </Toast.Header>
       <Toast.Body>
         { error }
       </Toast.Body>
     </Toast>
      )}
      <DrawGraph trigg = {trigg} graph={graphAlg.graph} width={width * 0.8} height={height} />
      <div className="sidebar">
        <textarea className="Inputmatrix" value={currInput} onChange={(e) => { console.log(e.target.value); setCurrInput(e.target.value)}} placeholder="Введите матрицу смежности" />
        <Button variant="success" onClick={handleSendMatrix}>Отправить</Button>
        <hr></hr>
    {selectedNode1 !== null && (<Form.Select aria-label="Default select example" value={selectedNode1} onChange={(e) => setSelectedNode1(e.target.value)}>
      <option selected>None</option>
      {graphAlg.graph.nodeList.map((node, i) => (
        <option key={i} value={i}>{node.name}</option>
      ))}
    </Form.Select>)}
    {selectedNode1 !== null && (<Form.Select aria-label="Default select example" value={selectedNode2} onChange={(e) => setSelectedNode2(e.target.value)}>
    <option selected>None</option>
      {graphAlg.graph.nodeList.map((node, i) => (
        <option key={i} value={i}>{node.name}</option>
      ))}
    </Form.Select>)}
    <Button variant="success" onClick={findPath}>Найти</Button>
    
      </div>
    </div>
  );
}

export { Mainframe }