import React, {useEffect, useMemo, useState} from "react";
import * as Interface from "../interface/graphFx"
import DrawGraph from "../display/drawGraph";
import { AdjMatrix } from "../input/adjMatrix";
import { IncMatrix } from "../input/incMatrix";
import { GraphFxAlgs } from "../processing/algorithms";
import "../css/sidebar.css";
import "../css/errorMsg.css";
import { Toast, Button, Modal, ButtonGroup } from 'react-bootstrap';
import { checkAdjMatrix, checkIncMatrix } from "./checkers";
import Form from 'react-bootstrap/Form';
import { NodeStyleKey } from "../styles/nodeStyle";
import { EdgeStyleKey } from "../styles/edgeStyle";
import { typeInput } from "./inputType";
import type { EdgeType } from "./forListOfEdges";
import { EdgesListToString } from "./forListOfEdges";
import { LisMatrix } from "../input/LisMatrix";

const Mainframe: React.FC<{}> = () => {
    const [currInput, setCurrInput] = useState("");
    const [input, setInput] = useState("");
    const [trigg, setTrigg] = useState(0);
    
    const [active, setActive] = useState<typeInput>(typeInput.ADJ);

    const graph = useMemo(() => {
      console.error('ВВОД, ПЕРЕЗАПИСЬ GRAPH');
      switch (active) {
        case typeInput.ADJ:
          return new AdjMatrix(input);
        case typeInput.INC:
          return new IncMatrix(input);
        case typeInput.LIS:
          console.error('START');
          console.error(input);
          return new LisMatrix(input);
        default:
          throw new Error('Неизвестный тип');
      }
    }, [input]);

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


    const sendInput = (error: string) => {
      setError(error);
      if (error === '') {
        setShowError(false);
        //console.log(currInput);
        console.warn(active);
        setInput(currInput);
        CloseInputWindow();
      } else { 
        setShowError(true);
      }
    } 
    const [edges, setEdges] = useState<EdgeType[]>([]);

    const handleSendMatrix = () => {
      console.log("HANDLE SEND MATRIX\n\n");
      let error = ''
      switch (active) {
        case typeInput.ADJ:
          error = checkAdjMatrix(currInput);
          sendInput(error);
          break;
        case typeInput.INC:
          error = checkIncMatrix(currInput);
          sendInput(error);
          break;
        case typeInput.LIS:
          let input = '';
          [input, error] = EdgesListToString(edges, edgeCount);
          setError(error);
          if (error === '') {
            setShowError(false);
            //console.log(currInput);
            console.warn(active);
            setInput(input);
            CloseInputWindow();
          } else { 
            setShowError(true);
          }
          break;
        default:
            setError('Ошибка выбора типа ввода');
            setShowError(true);
          break;
      }
    };
    //TODO РАЗБИТЬ НА МОДУЛИ
    const [showInputWindow, setShowInputWindow] = useState<boolean>(false);
    
    const OpenInputWindow = () => {
      setShowInputWindow(true);
    }
    const CloseInputWindow = () => {
      setShowInputWindow(false);
    }

    const [selectedNode1, setSelectedNode1] = useState<string>('');
    const [selectedNode2, setSelectedNode2] = useState<string>('');


    const findPath = () => {
      console.log('ПУТЬ');
      const err = graphAlg.dijkstra(graphAlg.graph.nodeList[parseInt(selectedNode1)], graphAlg.graph.nodeList[parseInt(selectedNode2)]);
      
      setError(err);
      if (err !== '') 
        setShowError(true);
      setTrigg(trigg + 1);

    };

    const showСonnСomps = () => {
      console.log('КОМПОНЕНТЫ');
      for (let i = 0; i <graphAlg.graph.nodeList.length; ++i) 
        graphAlg.graph.nodeList[i].style = NodeStyleKey.GROUP;
      let edges = graphAlg.graph.nodeList.reduce((acc: Interface.EdgeFx[], node) => acc.concat(node.out), []);
      for (let i = 0; i < edges.length; ++i) 
          edges[i].style = EdgeStyleKey.DEFAULT;
      setTrigg(trigg + 1);
    };

    const showOrdinal = () => {
      for (let i = 0; i <graphAlg.graph.nodeList.length; ++i) 
        graphAlg.graph.nodeList[i].style = NodeStyleKey.ORDINAL;
      let edges = graphAlg.graph.nodeList.reduce((acc: Interface.EdgeFx[], node) => acc.concat(node.out), []);
      for (let i = 0; i < edges.length; ++i) 
          edges[i].style = EdgeStyleKey.DEFAULT;
        

      setError(graphAlg.ordinalError);
      if (graphAlg.ordinalError !== '') 
        setShowError(true);
      else 
        setTrigg(trigg + 1);

    };
  //console.log(width, height);
  //console.log('APP', graphAlg.graph.nodeList.map(node => node.point));


  const showMaxSkeleton = () => {
    console.error('MAX SKELETON');
    const err = graphAlg.findSkeletonTree('MAX');
    setError(err);
    if (err !== '') 
      setShowError(true);
    else
      setTrigg(trigg + 1);

  };

  const showMinSkeleton = () => {
    console.error('MIN SKELETON');
    for (let i = 0; i <graphAlg.graph.nodeList.length; ++i) 
      console.error(graphAlg.graph.nodeList[i].style);
    const err = graphAlg.findSkeletonTree('MIN');
    setError(err);
    if (err !== '') 
      setShowError(true);
    else
      setTrigg(trigg + 1);
    
  };



  const [nodeCount, setNodeCount] = useState<number>(0);
  
  
  const [edgeCount, setEdgeCount] = useState<number>(0); 

  const UpdateNodeCount = (count : number) => {
    setNodeCount(count);
    const maxNodeId = count - 1;
    if (edges) {
      for (let i = 0; i < edges.length; ++i) {
        
        if ((edges[i].start ?? 0) > maxNodeId)
          edges[i].start = undefined;
        if ((edges[i].end ?? 0) > maxNodeId)
          edges[i].end = undefined;
      }
  }
  }

  const updateEdgeCount = (count: number) => {
    const prevCount = edges.length;
    setEdgeCount(count);
    if (count === 0) 
      setEdges([]);
    else {
      if (count > prevCount) {
        const newEdge : EdgeType = {
          start : undefined,
          end : undefined,
          weight: undefined
        }
        const newEdges = [...edges];
        newEdges.push(newEdge);
        setEdges(newEdges);
      } else if (count < prevCount) {
        const newEdges = [...edges];
        newEdges.pop();
        setEdges(newEdges);
      }
    }
  }

  const handleEdgeChange = (index: number, property: keyof EdgeType, value: number) => {
    const newEdges = [...edges];
    newEdges[index][property] = value;
    setEdges(newEdges);
  };

  //TODO переключатели между вводом матрицы смежности инцидентности и тд
  return (
    <div className="field">
      {showError && (
       <Toast show={showError} onClose={closeError} delay={5000} autohide style={{ position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#f44336', color: '#fff', padding: '10px', borderRadius: '10px', zIndex: '9999'}}>
       <Toast.Header closeButton={true} onClick={closeError}>
         <strong className="me-auto">Ошибка</strong>
       </Toast.Header>
       <Toast.Body>
         { error }
       </Toast.Body>
     </Toast>
      )}
      <DrawGraph trigg = {trigg} graph={graphAlg.graph} width={width * 0.8} height={height} />

      {showInputWindow && (
        <Modal show={showInputWindow} onHide={CloseInputWindow}><Modal.Header closeButton>
          <Modal.Title>Ввод</Modal.Title>
          </Modal.Header>
          <Modal.Body style = {{overflowY: 'auto'}}>
          <Form style = {{display: 'flex', flexDirection: 'column'}}>
        <ButtonGroup style ={{ marginBottom : '10px' }}>
          <Button variant="outline-success" active={active === typeInput.ADJ} onClick={() => setActive(typeInput.ADJ)} children = {typeInput.ADJ}></Button>
          <Button variant="outline-success" active={active === typeInput.INC} onClick={() => setActive(typeInput.INC)} children = {typeInput.INC}></Button>
          <Button variant="outline-success" active={active === typeInput.LIS} onClick={() => setActive(typeInput.LIS)} children = {typeInput.LIS}></Button>
        </ButtonGroup>

        <hr></hr>
        { active === typeInput.ADJ && (
          <textarea className="Inputmatrix" value={currInput} onChange={(e) => { console.log(e.target.value); setCurrInput(e.target.value)}} placeholder={active}  style = {{ whiteSpace: 'nowrap', overflowX: 'auto', letterSpacing: '3px', marginBottom : '5px', resize: 'none', height: '250px' }}/>
          )}
        { active === typeInput.INC && (
          <textarea className="Inputmatrix" value={currInput} onChange={(e) => { console.log(e.target.value); setCurrInput(e.target.value)}} placeholder={active}  style = {{ whiteSpace: 'nowrap', overflowX: 'auto', letterSpacing: '3px', marginBottom : '5px', resize: 'none', height: '250px' }}/>
          )}
        {active === typeInput.LIS && (
          <div style = {{overflowX: 'auto'}}>
            <div style = {{display: 'flex', flexDirection: 'row', marginBottom : '20px' }}>
              <div className="form-group" style = {{ marginRight: '20px' }}>
                <label>Количество вершин</label>
                <input type="number"  min="0" className="form-control" value={nodeCount} onChange={(e) => UpdateNodeCount(parseInt(e.target.value))} />
              </div>
              <div className="form-group" style = {{ }}>
                <label>Количество ребер</label>
                <input type="number" min="0" className="form-control" value={edgeCount} onChange={(e) => updateEdgeCount(parseInt(e.target.value))} />
              </div>
            </div>
            <div style = {{ overflowY: 'auto', maxHeight: '200px' }}>
            <table className="table table-bordered text-center" style = {{ height: '100px'}}>
              <thead>
                <tr>
                  <th>Начало ребра</th>
                  <th>Конец ребра</th>
                  <th>Вес ребра</th>
                </tr>
              </thead>
              <tbody>
                {Array(edges.length).fill(0).map((_, index) => (
                  <tr key={index}>
                    <td>
                      <select className="form-control" value={edges[index].start} onChange={(e) => handleEdgeChange(index, 'start', parseInt(e.target.value))}>
                      <option value={undefined}>-</option>
                        {Array(nodeCount).fill(0).map((_, nodeIndex) => (
                          <option key={nodeIndex} value={nodeIndex}>{nodeIndex}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <select className="form-control" value={edges[index].end} onChange={(e) => handleEdgeChange(index, 'end', parseInt(e.target.value))}>
                      <option value={undefined} >-</option>
                        {Array(nodeCount).fill(0).map((_, nodeIndex) => (
                          <option key={nodeIndex} value={nodeIndex}>{nodeIndex}</option>
                        ))}
                      </select>
                    </td>
                    <td style = {{ width: '140px'}}>
                      <input type="number" min="0" className="form-control" value={edges[index].weight} onChange={(e) => handleEdgeChange(index, 'weight', parseInt(e.target.value))} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        )}
          <Button variant="success" onClick={handleSendMatrix}>Отправить</Button>
          </Form>
        </Modal.Body>
        </Modal>
      )}
      <div className="sidebar">
        <Button variant="success" onClick={OpenInputWindow}>Ввод</Button>
        
        <hr></hr>

    {selectedNode1 !== null && (<Form.Select aria-label="Default select example" value={selectedNode1} onChange={(e) => setSelectedNode1(e.target.value)} style = {{ marginBottom : '5px' }}>
      <option selected>None</option>
      {graphAlg.graph.nodeList.map((node, i) => (
        <option key={i} value={i}>{node.name}</option>
      ))}
    </Form.Select>)}
    {selectedNode1 !== null && (<Form.Select aria-label="Default select example" value={selectedNode2} onChange={(e) => setSelectedNode2(e.target.value)} style = {{ marginBottom : '5px' }}>
    <option selected>None</option>
      {graphAlg.graph.nodeList.map((node, i) => (
        <option key={i} value={i}>{node.name}</option>
      ))}
    </Form.Select>)}
    <Button variant="success" onClick={findPath}>Найти</Button>
    <hr></hr>
    <Button variant="success" onClick={showСonnСomps}>показать компоненты связности</Button>
    <hr></hr>
    {graphAlg.isDirected && (
      <div>
        <Button variant="success" onClick={showOrdinal}>Показать уровни порядка</Button>
        <hr></hr>
    </div>
)}
    
    {!graphAlg.isDirected && ( 
      <div>
        <Button variant="success" style = {{ marginBottom : '5px' }} onClick={showMinSkeleton}>Показать остов минимального веса</Button>
        <Button variant="success" onClick={showMaxSkeleton}>Показать остов максимального веса</Button>
        <hr></hr>
      </div>
      )}
      
      </div>
    </div>
  );
}

export { Mainframe }