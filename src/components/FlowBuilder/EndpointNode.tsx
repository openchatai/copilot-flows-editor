import { Handle, NodeProps, Position, useNodes, useReactFlow } from "reactflow";
import { TransformedPath } from "./types/Swagger";
import cn from "../../utils/cn";
import { useMode } from "../stores/ModeProvider";
import { useMemo } from "react";
type CustomNodeData = TransformedPath;
const HideHandleStyles = {
  background: "transparent",
  fill: "transparent",
  color: "transparent",
  border: "none",
};
export function EndpointNode({ data, id }: NodeProps<CustomNodeData>) {
  const nodes = useNodes();
  const { mode } = useMode();

  const isActive = useMemo(() => {
    if (mode.type === "edit-node") {
      return mode.node.id === id;
    } else {
      return false;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);
  const isFirstNode = nodes?.[0]?.id === id;

  return (
    <>
      {!isFirstNode && (
        <Handle
          type="source"
          position={Position.Top}
          id="in"
          style={HideHandleStyles}
        />
      )}
      <div
        className={cn(
          "bg-white border duration-300  ease-in-out rounded w-[200px] min-h-[50px] select-none cursor-pointer transition-all",
          isActive
            ? "border-indigo-500 [box-shadow:inset_0px_2.5px_0px_0px_theme(colors.indigo.500)]"
            : "border-slate-200 hover:shadow"
        )}
      >
        <div className="p-2">
          <span className="block">{data.path}</span>
          <span className="uppercase text-xs font-bold text-indigo-500">
            METHOD
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
