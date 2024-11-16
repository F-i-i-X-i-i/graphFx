
import * as Interface from "../interface/graphFx"

function getTPlus(node: Interface.NodeFx, graph: Interface.GraphFx): Interface.NodeFx[] {
    const visited: Set<Interface.NodeFx> = new Set();
    const stack: Interface.NodeFx[] = [node];

    while (stack.length > 0) {
        const currentNode = stack.pop() as Interface.NodeFx;
        if (!visited.has(currentNode)) {
            visited.add(currentNode);

            currentNode.out.forEach((edge) => {
                const neighbor = edge.end;
                if (!visited.has(neighbor)) {
                    stack.push(neighbor);
                }
            });
        }
    }

    return Array.from(visited);
}

function getTMinus(node: Interface.NodeFx, graph: Interface.GraphFx): Interface.NodeFx[] {
    const visited: Set<Interface.NodeFx> = new Set();
    const stack: Interface.NodeFx[] = [node];

    while (stack.length > 0) {
        const currentNode = stack.pop() as Interface.NodeFx;
        if (!visited.has(currentNode)) {
            visited.add(currentNode);

            currentNode.in.forEach((edge) => {
                const neighbor = edge.start;
                if (!visited.has(neighbor)) {
                    stack.push(neighbor);
                }
            });
        }
    }

    return Array.from(visited);
}

function getIntersection(arr1: Interface.NodeFx[], arr2: Interface.NodeFx[]): Interface.NodeFx[] {
    return arr1.filter((node) => arr2.includes(node));
}

export { getTPlus, getTMinus, getIntersection }