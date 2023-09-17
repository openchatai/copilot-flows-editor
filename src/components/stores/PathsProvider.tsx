import { useState } from "react";
import { createSafeContext } from "../../utils/create-safe-context";
import { TransformedPath } from "../FlowBuilder/types/Swagger";
import { transformPaths } from "../FlowBuilder/utils/transformSwagger";
type PathsContext = {
  paths: TransformedPath[];
  load: (json: any) => void;
};
const [PathsSafeProvider, usePaths] = createSafeContext<PathsContext>({
  paths: [],
  load: () => {},
});

function PathsProvider({ children }: { children: React.ReactNode }) {
  const [paths, setPaths] = useState<TransformedPath[]>([]);
  function load(json: any) {
    const paths = transformPaths(json);
    console.log(paths);
    setPaths(paths);
  }
  return (
    <PathsSafeProvider
      value={{
        paths,
        load,
      }}
    >
      {children}
    </PathsSafeProvider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export { PathsProvider, usePaths };
