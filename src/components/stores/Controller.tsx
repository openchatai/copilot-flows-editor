import { useReducer, type ReactNode, useCallback } from "react";
import { createSafeContext } from "../../utils/create-safe-context";
import { TransformedPath } from "../FlowBuilder/types/Swagger";
import { produce } from "immer";
type StateShape = {
  paths: TransformedPath[];
  codeExpanded: boolean;
};

type ControllerContextType = {
  // paths, loadPaths, flows, createFlow
  loadPaths: (paths: TransformedPath[]) => void;
  state: StateShape;
  toggleCodeExpanded: () => void;
};

type ActionType =
  | { type: "init" }
  | { type: "load-paths"; pyload: TransformedPath[] }
  | { type: "toggle-code-expanded" };

const initialStateValue: StateShape = {
  paths: [],
  codeExpanded: false,
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
  return (
    <SafeProvider
      value={{
        loadPaths,
        state,
        toggleCodeExpanded,
      }}
    >
      {children}
    </SafeProvider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export { useController, Controller };
