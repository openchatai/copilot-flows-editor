import { createSafeContext } from "../../utils/create-safe-context";
import { TransformedPath } from "../FlowBuilder/types/Swagger";

const [PathsProvider, usePaths] = createSafeContext<{
  paths: TransformedPath[];
}>({
  paths: [],
});

// eslint-disable-next-line react-refresh/only-export-components
export { PathsProvider, usePaths };
