import { useReducer, type ReactNode, useCallback, useMemo } from "react";
import { createSafeContext } from "../../utils/create-safe-context";
import { NodeData, TransformedPath } from "../FlowBuilder/types/Swagger";
import { produce } from "immer";
import { genId } from "../FlowBuilder/utils/genId";
import { Node } from "reactflow";

type EndpointNodeType = Node<NodeData>;

type StateShape = {
  paths: TransformedPath[];
  codeExpanded: boolean;
  activeFlowId?: string;
  flows: {
    name: string;
    description?: string;
    createdAt: number;
    steps: EndpointNodeType[];
    id: string;
  }[];
};

type ControllerContextType = {
  loadPaths: (paths: TransformedPath[]) => void;
  state: StateShape;
  activeNodes?: EndpointNodeType[];
  toggleCodeExpanded: () => void;
  createFlow: (data: CreateFlowPayload) => void;
  setActiveFlow: (id: string) => void;
  setNodes: (nodes: Node[]) => void;
};

type ActionType =
  | { type: "init" }
  | { type: "load-paths"; pyload: TransformedPath[] }
  | { type: "toggle-code-expanded" }
  | { type: "set-active-flow"; pyload: string }
  | {
      type: "create-flow";
      pyload: {
        name: string;
        description?: string;
        createdAt: number;
      };
    }
  | { type: "set-flows"; pyload: StateShape["flows"] }
  | { type: "set-nodes"; payload: Node[] };

type CreateFlowPayload = Extract<ActionType, { type: "create-flow" }>["pyload"];

const initialStateValue: StateShape = {
  paths: [],
  codeExpanded: false,
  flows: [],
};
const [SafeProvider, useController] = createSafeContext<ControllerContextType>(
  {} as ControllerContextType
);
function stateReducer(state: StateShape, action: ActionType) {
  return produce(state, (draft) => {
    switch (action.type) {
      case "init":
        break;
      case "load-paths":
        draft.paths = action.pyload;
        break;
      case "toggle-code-expanded":
        draft.codeExpanded = !state.codeExpanded;
        break;
      case "set-active-flow":
        draft.activeFlowId = action.pyload;
        break;
      case "create-flow":
        draft.flows.push({
          ...action.pyload,
          steps: [],
          id: genId(),
        });
        break;
      case "set-nodes":
        {
          const flow = draft.flows.find((f) => f.id === state.activeFlowId);
          if (!flow) return;
          console.log(flow);
          console.log(action.payload);
          flow.steps = action.payload;
        }
        break;
      default:
        break;
    }
  });
}

function Controller({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(stateReducer, initialStateValue);
  // @remember to wrap all functions with useCallback
  const loadPaths = useCallback(
    (paths: TransformedPath[]) =>
      dispatch({
        type: "load-paths",
        pyload: paths,
      }),
    []
  );
  const toggleCodeExpanded = useCallback(
    () => dispatch({ type: "toggle-code-expanded" }),
    []
  );
  const createFlow = useCallback(
    (data: CreateFlowPayload) =>
      dispatch({
        type: "create-flow",
        pyload: data,
      }),
    []
  );
  const setActiveFlow = useCallback(
    (id: string) =>
      dispatch({
        type: "set-active-flow",
        pyload: id,
      }),
    []
  );
  const activeNodes = useMemo(() => {
    if (!state.activeFlowId) return undefined;
    const flow = state.flows.find((f) => f.id === state.activeFlowId);
    if (!flow) return undefined;
    return flow.steps;
  }, [state.activeFlowId, state.flows]);

  const setNodes = useCallback(
    (nodes: Node[]) =>
      dispatch({
        type: "set-nodes",
        payload: nodes,
      }),
    []
  );
  return (
    <SafeProvider
      value={{
        loadPaths,
        state,
        toggleCodeExpanded,
        createFlow,
        setActiveFlow,
        activeNodes,
        setNodes,
      }}
    >
      {children}
    </SafeProvider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export { useController, Controller };
