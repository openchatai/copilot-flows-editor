import { useReducer, type ReactNode, useCallback } from "react";
import { createSafeContext } from "../../utils/create-safe-context";
import { NodeData, TransformedPath } from "../FlowBuilder/types/Swagger";
import { produce } from "immer";
import { genId } from "../FlowBuilder/utils/genId";

type StateShape = {
  paths: TransformedPath[];
  codeExpanded: boolean;
  activeFlowId?: string;
  flows: {
    name: string;
    description?: string;
    createdAt: number;
    steps: NodeData[];
    id: string;
  }[];
};

type ControllerContextType = {
  // paths, loadPaths, flows, createFlow
  loadPaths: (paths: TransformedPath[]) => void;
  state: StateShape;
  toggleCodeExpanded: () => void;
  createFlow: (data: CreateFlowPayload) => void;
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
  | { type: "set-flows"; pyload: StateShape["flows"] };
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
  switch (action.type) {
    case "init":
      return state;
    case "load-paths":
      return produce(state, (draft) => {
        draft.paths = action.pyload;
      });
    case "toggle-code-expanded":
      return produce(state, (draft) => {
        draft.codeExpanded = !state.codeExpanded;
      });
    case "set-active-flow":
      return produce(state, (draft) => {
        draft.activeFlowId = action.pyload;
      });
    case "create-flow":
      return produce(state, (draft) => {
        console.log(action.pyload);
        draft.flows.push({
          ...action.pyload,
          steps: [],
          id: genId(),
        });
      });
    default:
      return state;
  }
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
  return (
    <SafeProvider
      value={{
        loadPaths,
        state,
        toggleCodeExpanded,
        createFlow,
      }}
    >
      {children}
    </SafeProvider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export { useController, Controller };
