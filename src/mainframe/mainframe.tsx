import React, {useEffect, useMemo, useState} from "react";
//import * as Interface from "../interface/graphFx"
import DrawGraph from "../display/drawGraph";
import { AdjMatrix } from "../input/adjMatrix";
import { GraphFxAlgs } from "../processing/algorithms";
import "../css/sidebar.css";
import "../css/errorMsg.css";
import { Toast, ToastBody, Button } from 'react-bootstrap';
import { checkMatrix } from "./checkers";


const Mainframe: React.FC<{}> = () => {
    const [currInput, setCurrInput] = useState("");
    const [input, setInput] = useState("");
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

    const handleSendMatrix = () => {
      const error = checkMatrix(currInput);
      setError(error);
      if (error === '') {
        //console.log(currInput);
        setInput(currInput);
      } else { 
        setShowError(true);
      }
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
      <DrawGraph graph={graphAlg.graph} width={width * 0.8} height={height} />
      <div className="sidebar">
        <textarea className="Inputmatrix" value={currInput} onChange={(e) => setCurrInput(e.target.value)} placeholder="Введите матрицу смежности" />
        <Button variant="success" onClick={handleSendMatrix}>Отправить</Button>
      </div>
    </div>
  );
}

export { Mainframe }