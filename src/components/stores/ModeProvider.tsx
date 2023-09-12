import { createSafeContext } from "../../utils/create-safe-context";
import type { Edge, Node } from "reactflow";
import { TransformedPath } from "../FlowBuilder/types/Swagger";
import { useState } from "react";

type AppendNodeMode = {
  type: "append-node";
};
type AddNodeBetweenMode = {
  type: "add-node-between";
  edge: Edge;
};
type EditNodeMode = {
  type: "edit-node";
  node: Node<TransformedPath>;
};

export type Mode = AppendNodeMode | AddNodeBetweenMode | EditNodeMode;

const [ModeSafeProvider, useMode] = createSafeContext<{
  mode: Mode;
  setMode: React.Dispatch<React.SetStateAction<Mode>>;
  reset: () => void;
}>({
  mode: { type: "append-node" },
  setMode: () => {},
  reset: () => {},
});
const DEFAULT: Mode = { type: "append-node" };
function ModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<Mode>(DEFAULT);
  function reset() {
    setMode(DEFAULT);
  }
  return (
    <ModeSafeProvider value={{ mode, setMode, reset }}>
      {children}
    </ModeSafeProvider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export { ModeProvider, useMode };
