import { type Edge, type Node } from "reactflow";
import { useCallback, useMemo, useState } from "react";
import { NodeData } from "../types/Swagger";
import { createSafeContext } from "../utils/create-safe-context";
type IdleMode = {
  type: "idle";
};
type AppendNodeMode = {
  type: "append-node";
};
type AddNodeBetweenMode = {
  type: "add-node-between";
  edge: Edge;
};
type EditNodeMode = {
  type: "edit-node";
  node: Node<NodeData>;
};

export type Mode =
  | AppendNodeMode
  | AddNodeBetweenMode
  | EditNodeMode
  | IdleMode;
const DEFAULT: Mode = { type: "append-node" };
type ModeContextType = {
  mode: Mode;
  setMode: React.Dispatch<React.SetStateAction<Mode>>;
  reset: () => void;
  isAdd: boolean;
  isEdit: boolean;
  isIdle: boolean;
};

const [ModeSafeProvider, useMode] = createSafeContext<ModeContextType>(
  {} as ModeContextType
);
function ModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, $setMode] = useState<Mode>(DEFAULT);
  const reset = useCallback(() => $setMode(DEFAULT), []);
  const setMode = useCallback($setMode, [$setMode]);
  const isAdd = useMemo(
    () => mode.type === "append-node" || mode.type === "add-node-between",
    [mode]
  );
  const isIdle = useMemo(() => mode.type === "idle", [mode]);
  const isEdit = useMemo(() => mode.type === "edit-node", [mode]);
  return (
    <ModeSafeProvider value={{ mode, setMode, reset, isAdd, isEdit, isIdle }}>
      {children}
    </ModeSafeProvider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export { ModeProvider, useMode };
