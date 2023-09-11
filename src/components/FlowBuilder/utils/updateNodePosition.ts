import type { Node } from 'reactflow';
export function updateNodePositions(nodes: Node[], Y: number) {
    // Choose a suitable distance
    const updatedNodes = nodes.map((node, index) => ({
        ...node,
        position: { x: 0, y: index * Y },
    }));
    return updatedNodes;
}
