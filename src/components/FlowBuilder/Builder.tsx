import ReactFlow, {
  Background,
  Node,
  OnConnect,
  addEdge,
  useNodesState,
  useEdgesState,
} from "reactflow";
import { useCallback, useEffect, useMemo, useState } from "react";
import "reactflow/dist/style.css";
import { NodeEdge } from "./EndpointEdge";
import { EndpointNode } from "./EndpointNode";
import AsideMenu from "./AsideMenu";
import { ModeProvider, useMode } from "../stores/ModeProvider";
import { TransformedPath } from "./types/Swagger";
import { Cross2Icon } from "@radix-ui/react-icons";

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
  function toogleCodeSidebar() {
    setIsCodeSidebarOpen(!isCodeSidebarOpen);
  }
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
  const [nodes, , onNodesChange] = useNodesState<TransformedPath>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { mode, setMode, reset: resetMode } = useMode();
  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );
  console.log(nodes);
  function HandleNodeClick(
    event: React.MouseEvent<Element, MouseEvent>,
    node: Node
  ) {
    switch (node.type) {
      case "endpointNode":
        // if node already active and clicked again, switch to append. (user want to add another node)
        if (mode.type === "edit-node" && mode.node.id === node.id) {
          resetMode();
        } else {
          setMode({ type: "edit-node", node: node });
        }
    }
  }
  return (
    <>
      {isCodeSidebarOpen && (
        <>
          <div className="fixed inset-0 backdrop-blur-sm bg-slate-500/50 z-50">
            <div className="flex items-center justify-center w-full h-full p-5">
              <div className="max-w-md w-full min-h-fit bg-white aspect-square rounded flex flex-col">
                <header className="p-3 border-b border-b-gray-400 flex items-center justify-between">
                  <div>
                    <h2>Flow Code</h2>
                    <span>not the actual code</span>
                  </div>
                  <button
                    className=""
                    onClick={() => setIsCodeSidebarOpen(false)}
                  >
                    <Cross2Icon />
                  </button>
                </header>
                <div className="flex-1">
                  <textarea
                    className="outline-none h-full resize-none w-full p-3"
                    rows={4}
                  >
                    {JSON.stringify(nodes)}
                  </textarea>
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
            onNodeClick={HandleNodeClick}
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
