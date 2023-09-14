import ReactFlow, {
  Background,
  OnConnect,
  addEdge,
  useNodesState,
  useEdgesState,
  MarkerType,
  Edge,
} from "reactflow";
import { useCallback, useEffect, useMemo, useState } from "react";
import "reactflow/dist/style.css";
import { NodeEdge } from "./EndpointEdge";
import { EndpointNode } from "./EndpointNode";
import AsideMenu from "./AsideMenu";
import { ModeProvider, useMode } from "../stores/ModeProvider";
import type { NodeData } from "./types/Swagger";
import { Cross2Icon } from "@radix-ui/react-icons";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atelierPlateauLight } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { js } from "js-beautify";
function FLowBuilder_() {
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
  const [isCodeSidebarOpen, setIsCodeSidebarOpen] = useState(false);
  const [nodes, , onNodesChange] = useNodesState<NodeData>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { setMode } = useMode();

  function toogleCodeSidebar() {
    setIsCodeSidebarOpen((v) => !v);
  }

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

  useEffect(() => {
    const codeToggler = document.getElementById(
      "show-code-btn"
    ) as HTMLButtonElement;

    codeToggler.addEventListener("click", toogleCodeSidebar);
    return () => {
      codeToggler.removeEventListener("click", toogleCodeSidebar);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  const data = useMemo(() => nodes.map((node) => node.data), [nodes]);

  return (
    <>
      {isCodeSidebarOpen && (
        <>
          <div className="fixed inset-0 backdrop-blur-sm bg-slate-500/50 z-50">
            <div className="flex items-center justify-center w-full h-full p-5">
              <div className="max-w-lg w-full min-h-fit bg-white max-h-full rounded flex flex-col">
                <header className="p-3 border-b border-b-gray-400 flex items-center justify-between">
                  <div>
                    <h2>Flow Code</h2>
                  </div>
                  <button onClick={() => setIsCodeSidebarOpen(false)}>
                    <Cross2Icon />
                  </button>
                </header>
                <div className="flex-1 overflow-hidden overflow-y-auto">
                  <SyntaxHighlighter
                    className="outline-none h-full resize-none w-full max-h-full p-3 max-w-full "
                    rows={4}
                    language="json"
                    wrapLongLines
                    style={atelierPlateauLight}
                  >
                    {js(JSON.stringify(data))}
                  </SyntaxHighlighter>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      <div className="flex-1 w-full flex items-center">
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
            edgeTypes={edgeTypes}
            maxZoom={1}
            minZoom={1}
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

export default function ReactFlowBuilder() {
  return (
    <ModeProvider>
      <FLowBuilder_ />
    </ModeProvider>
  );
}
