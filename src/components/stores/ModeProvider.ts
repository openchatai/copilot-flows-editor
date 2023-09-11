import { createSafeContext } from "../../utils/create-safe-context";
import type { Edge, Node } from "reactflow";

type AppendNodeMode = {
    type: "append-node";
}
type AddNodeBetweenMode = {
    type: "add-node-between";
    edge: Edge;
}
type EditNodeMode = {
    type: "edit-node";
    node: Node;
}

export type Mode = AppendNodeMode | AddNodeBetweenMode | EditNodeMode;

const [ModeProvider, useMode] = createSafeContext<{ mode: Mode, setMode: React.Dispatch<React.SetStateAction<Mode>> }>({
    mode: { type: "append-node" },
    setMode: () => { }
});
export { ModeProvider, useMode };