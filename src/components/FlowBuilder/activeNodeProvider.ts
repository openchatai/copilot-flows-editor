import { createSafeContext } from "../../utils/create-safe-context";
import type { Node } from "reactflow";
const [ActiveNodeProvider, useActiveNode] = createSafeContext<{ activeNode: Node | undefined }>(
    { activeNode: undefined }
);

export { ActiveNodeProvider, useActiveNode };