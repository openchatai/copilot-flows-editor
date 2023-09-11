import { PlusIcon } from "@radix-ui/react-icons";
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getStraightPath,
} from "reactflow";
import { useMode } from "../stores/ModeProvider";
import { useMemo } from "react";
import cn from "../../utils/cn";

export function NodeEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  ...props
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });
  const { mode } = useMode();
  const activeEdge = useMemo(() => {
    if (mode.type === "add-node-between") return mode.edge;
  }, [mode]);
  return (
    <>
      <EdgeLabelRenderer>
        <div
          className="nodrag nopan text-sm"
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: "all",
          }}
        >
          <button
            className={cn(
              "rounded bg-[#ddd]",
              activeEdge?.id === props.id
                ? "ring-4 ring-offset-1 ring-offset-indigo-300 ring-indigo-500"
                : ""
            )}
          >
            <PlusIcon strokeWidth={3} />
          </button>
        </div>
      </EdgeLabelRenderer>
      <BaseEdge
        {...props}
        path={edgePath}
        style={{
          strokeWidth: 2,
          stroke: "#ddd",
        }}
      />
    </>
  );
}
