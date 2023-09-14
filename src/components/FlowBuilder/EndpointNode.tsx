import {
  Handle,
  NodeProps,
  Position,
  useNodeId,
  useNodes,
  NodeToolbar,
  useReactFlow,
} from "reactflow";
import { NodeData } from "./types/Swagger";
import cn from "../../utils/cn";
import { useMode } from "../stores/ModeProvider";
import { useMemo } from "react";
import { Y } from "./consts";
import { updateNodePositions } from "./utils/updateNodePosition";
import { TrashIcon } from "@radix-ui/react-icons";
const HideHandleStyles = {
  background: "transparent",
  fill: "transparent",
  color: "transparent",
  border: "none",
};
export function EndpointNode({ data }: NodeProps<NodeData>) {
  console.log(data);
  const nodes = useNodes<NodeData>();
  const { setNodes } = useReactFlow();
  const nodeId = useNodeId();
  const nodeObj = nodes.find((n) => n.id === nodeId);
  const { mode, setMode, reset: resetMode } = useMode();
  const isActive = useMemo(() => {
    if (mode.type === "edit-node") {
      return mode.node.id === nodeId;
    } else {
      return false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);
  const isFirstNode = nodes?.[0]?.id === nodeId;
  function clickHandler() {
    // if node already active and clicked again, switch to append. (user want to add another node)
    if (mode.type === "edit-node" && mode.node.id === nodeId) {
      resetMode();
    } else {
      nodeObj && setMode({ type: "edit-node", node: nodeObj });
    }
  }

  function deleteNode() {
    setNodes(
      updateNodePositions(
        nodes.filter((nd) => nd.id !== nodeId),
        Y
      )
    );
    resetMode();
  }
  return (
    <>
      <NodeToolbar align="center" position={Position.Left}>
        <button
          onClick={deleteNode}
          className="p-2 rounded-full text-rose-500 text-lg bg-neutral-100 hover:bg-neutral-200 transition-colors"
        >
          <TrashIcon />
        </button>
      </NodeToolbar>
      {!isFirstNode && (
        <Handle
          type="source"
          position={Position.Top}
          id="in"
          style={HideHandleStyles}
        />
      )}
      <div
        onClick={clickHandler}
        className={cn(
          "bg-white border group relative duration-300  ease-in-out rounded w-[200px] min-h-[50px] select-none cursor-pointer transition-all",
          isActive
            ? "border-indigo-500 [box-shadow:inset_0px_2.5px_0px_0px_theme(colors.indigo.500)]"
            : "border-slate-200 hover:shadow"
        )}
      >
        <div className="p-2">
          <span className="block">{data.path}</span>
          <span className="uppercase text-xs font-bold text-indigo-500">
            {data.method}
          </span>
        </div>
      </div>
      <Handle
        type="target"
        style={HideHandleStyles}
        position={Position.Bottom}
        id="out"
      />
    </>
  );
}
