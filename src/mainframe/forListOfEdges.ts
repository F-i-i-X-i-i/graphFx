
interface Edge {
    start: number | undefined;
    end: number | undefined;
    weight: number | undefined;
  }

function EdgesListToString(list: Edge[], edgeCount: number) : [string, string] {
    let result = '';
    let error = '';

    if (edgeCount !== list.length)
        error += 'Количество введенных ребер отличается от рассчитанного';
    

    if (list.length > 0) {
        for (let i = 0; i < list.length; i++) {
            const edge = list[i];
            if (edge === undefined || edge.start === undefined || edge.end === undefined || edge.weight === undefined) 
                error += `Ошибка в ребре ${i + 1}: null значение\n`;
            else {
                if (edge.start < 0 || edge.end < 0 || edge.weight < 0) 
                    error += `Ошибка в ребре ${i + 1}: отрицательное значение\n`;
                if (isNaN(edge.start) || isNaN(edge.end) || isNaN(edge.weight))
                    error += `Ошибка в ребре ${i + 1}: не число\n`;
                result += `${edge.start} ${edge.end} ${edge.weight}\n`;
            }   
        }
    }
    result = result.slice(0, -1);
    return [result, error];
}

export { EdgesListToString };
export type EdgeType = Edge;

