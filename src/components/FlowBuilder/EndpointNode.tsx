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
import { Y, nodedimensions } from "./consts";
import { updateNodePositions } from "./utils/updateNodePosition";
import { PlusIcon, TrashIcon } from "@radix-ui/react-icons";
import { MethodBtn } from "./MethodRenderer";
const HideHandleStyles = {
  background: "transparent",
  fill: "transparent",
  color: "transparent",
  border: "none",
};
export function EndpointNode({ data, zIndex }: NodeProps<NodeData>) {
  const nodes = useNodes<NodeData>();
  const { setNodes } = useReactFlow();
  const nodeId = useNodeId();
  const nodeObj = nodes.find((n) => n.id === nodeId);
  const { mode, setMode, reset: resetMode, isEdit } = useMode();

  const isActive = useMemo(() => {
    if (mode.type === "edit-node") {
      return mode.node.id === nodeId;
    } else {
      return false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const isFirstNode = nodes?.[0]?.id === nodeId;
  const isLastNode = nodes?.[nodes.length - 1]?.id === nodeId;
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
      <NodeToolbar align="center" isVisible={isActive} position={Position.Left}>
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
        className="relative"
        style={{
          height: `min(${nodedimensions.height}px,fit-content)`,
          width: `${nodedimensions.width}px`,
        }}
      >
        <div
          onClick={() => {
            nodeObj && setMode({ type: "edit-node", node: nodeObj });
          }}
          className={cn(
            "bg-white border group duration-300 ease-in-out rounded select-none cursor-pointer transition-all h-full w-full",
            isActive
              ? "border-indigo-500 [box-shadow:inset_0px_2.5px_0px_0px_theme(colors.indigo.500)]"
              : "border-slate-200 hover:shadow"
          )}
        >
          <div className="p-2 space-y-2">
            <code className="block text-sm text-slate-800">{data.path}</code>
            <p className="text-[8px] ms-2 text-slate-600 font-medium line-clamp-2">
              {data.description}
            </p>
            <MethodBtn
              method={data.method}
              className="uppercase text-[10px] font-bold py-0.5 px-1 ms-auto cursor-default"
            >
              {data.method}
            </MethodBtn>
          </div>
        </div>
        {isLastNode && (
          <div
            data-btn="append-node"
            className="absolute w-0.5 bg-[#ddd] left-1/2 flex items-center justify-center rounded"
            style={{
              height: Y / 2 + "px",
              zIndex: zIndex,
            }}
          >
            <button
              onClick={() => setMode({ type: "append-node" })}
              className={cn(
                "text-sm rounded bg-[#ddd] p-0.5 transition-all duration-300 ease-in-out",
                mode.type === "append-node" &&
                  "bg-indigo-400 ring-indigo-200 ring-4 ring-offset-transparent text-indigo-400"
              )}
            >
              <PlusIcon />
            </button>
          </div>
        )}
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
