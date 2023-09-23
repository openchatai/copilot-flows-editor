import { Y } from "../editor/consts";
import type { EndpointNodeType } from "../types/Flow";
import { genId } from "./genId";

export function trasnformEndpointNodesData(nodes: EndpointNodeType[]): EndpointNodeType['data'][] {
    return nodes.map((node) => node.data);
}
// the reverse of the above function
export function transformaEndpointToNode(data: EndpointNodeType['data'][]): Partial<EndpointNodeType[]> {
    return data.map((nodeData, index) => ({
        id: genId(),
        type: 'endpointNode',
        position: {
            x: 0,
            y: index * Y
        },
        data: nodeData
    }))
}