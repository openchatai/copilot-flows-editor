import ReactFlow, {
  Background,
  OnConnect,
  addEdge,
  useEdgesState,
  MarkerType,
  Edge,
  applyNodeChanges,
  NodeChange,
  useReactFlow,
} from "reactflow";
import { useCallback, useEffect, useMemo } from "react";
import "reactflow/dist/style.css";
import { NodeEdge } from "./EndpointEdge";
import EndpointNode from "./EndpointNode";
import { AsideMenu } from "./AsideMenu";
import { useMode } from "../stores/ModeProvider";
import { BUILDER_SCALE } from "./consts";
import { useController } from "../stores/Controller";

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
  const { fitView } = useReactFlow();
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  // the state will be derived from the global controller state
  const {
    activeNodes,
    setNodes,
    state: { activeFlowId },
  } = useController();
  const { setMode } = useMode();
  // auto connect nodes
  useEffect(() => {
    if (!activeNodes) return;
    if (activeNodes.length === 0) {
      setMode({ type: "append-node" });
      return;
    }
    fitView();
    const newEdges = activeNodes
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
  }, [activeNodes]);

  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      const _ = applyNodeChanges(changes, activeNodes || []);
      console.log("nodes changed", _);
      setNodes(_);
    },
    [setNodes, activeNodes]
  );
  const empty = useMemo(() => {
    return activeNodes?.length === 0 || activeFlowId === undefined;
  }, [activeNodes, activeFlowId]);
  return (
    <>
      <div className="flex-1 h-full flex items-center overflow-hidden relative">
        <AsideMenu />
        <div className="flex-1 h-full relative">
          {empty && (
            <div
              className="absolute inset-0 z-40 bg-black/10 group select-none"
              data-container="empty-state"
            >
              <div className="flex items-center justify-center h-full">
                <div className="max-w-xs w-full p-2 rounded border transition-opacity border-dashed text-neutral-800 text-center text-base border-neutral-500">
                  {activeFlowId
                    ? "Start by selecting an endpoint from the menu"
                    : "Start by creating a flow"}
                </div>
              </div>
            </div>
          )}
          <ReactFlow
            nodeTypes={nodeTypes}
            nodes={activeNodes}
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
