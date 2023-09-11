import { createSafeContext } from "../../utils/create-safe-context";
import type { Node } from "reactflow";
const [MutateNodesProvider, useMutateNodes] = createSafeContext<{ nodes: Node[] }>({
    nodes: []
});

export { MutateNodesProvider, useMutateNodes };