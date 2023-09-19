import ReactFlow, {
  Background,
  OnConnect,
  addEdge,
  useNodesState,
  useEdgesState,
  MarkerType,
  Edge,
} from "reactflow";
import { useCallback, useEffect, useMemo } from "react";
import "reactflow/dist/style.css";
import { NodeEdge } from "./EndpointEdge";
import EndpointNode from "./EndpointNode";
import { AsideMenu } from "./AsideMenu";
import { useMode } from "../stores/ModeProvider";
import type { NodeData } from "./types/Swagger";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { BUILDER_SCALE } from "./consts";

export function FlowArena() {
  const nodeTypes = useMemo(
    () => ({
      endpointNode: EndpointNode,
    }),
    []
  );
  const edgeTypes = useMemo(
    () => ({
      endpointEdge: NodeEdge,
    }),
    []
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [nodes, , onNodesChange] = useNodesState<NodeData>([]);
  const { setMode, isIdle } = useMode();
  // auto connect nodes
  useEffect(() => {
    if (nodes.length === 0) {
      setMode({ type: "append-node" });
      return;
    }
    const newEdges = nodes
      .map((v, i, a) => {
        const curr = v;
        const next = a.at(i + 1);
        if (curr && next) {
          const id = curr.id + "-" + next.id;
          return {
            id: id,
            target: curr.id,
            source: next.id,
            type: "endpointEdge",
            markerStart: {
              type: MarkerType.ArrowClosed,
            },
          };
        }
      })
      .filter((v) => typeof v !== "undefined") as Edge[];
    setEdges(newEdges);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes]);

  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  return (
    <>
      <div className="flex-1 h-full flex items-center overflow-hidden relative">
        {isIdle && (
          <button
            onClick={() => setMode({ type: "append-node" })}
            className="absolute animate-in fade-in p-2 rounded-full text-lg border border-stone-400 text-slate-800 top-3 left-3 z-50"
          >
            <HamburgerMenuIcon />
          </button>
        )}
        <AsideMenu />
        <div className="flex-1 h-full relative">
          {nodes.length === 0 && (
            <div
              className="absolute inset-0 z-40 bg-black/10 group select-none"
              data-container="empty-state"
            >
              <div className="flex items-center justify-center h-full">
                <div className="max-w-xs w-full p-2 rounded border opacity-50 group-hover:opacity-100 transition-opacity border-dashed text-neutral-800 text-center text-base border-neutral-500">
                  Start by selecting an endpoint from the menu
                </div>
              </div>
            </div>
          )}
          <ReactFlow
            nodeTypes={nodeTypes}
            nodes={nodes}
            edges={edges}
            onEdgeClick={(event, edge) => {
              event.stopPropagation();
              event.bubbles = false;
              setMode({
                type: "add-node-between",
                edge: edge,
              });
            }}
            className="transition-all duration-300 origin-center flex-1"
            edgeTypes={edgeTypes}
            maxZoom={BUILDER_SCALE}
            minZoom={BUILDER_SCALE}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            deleteKeyCode={[]}
            fitView
          >
            <Background />
          </ReactFlow>
        </div>
      </div>
    </>
  );
}
