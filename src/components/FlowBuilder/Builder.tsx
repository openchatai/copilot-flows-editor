import ReactFlow, {
  Background,
  Node,
  OnConnect,
  addEdge,
  useNodesState,
  useEdgesState,
} from "reactflow";
import { useCallback, useMemo, useState } from "react";
import "reactflow/dist/style.css";
import { NodeEdge } from "./EndpointEdge";
import { EndpointNode } from "./EndpointNode";
import AsideMenu from "./AsideMenu";
import { Mode, ModeProvider } from "../stores/ModeProvider";

export default function ReactFlowBuilder() {
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
  const [nodes, , onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [mode, setMode] = useState<Mode>({
    type: "append-node",
  });
  console.log(mode);
  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  function HandleNodeClick(
    event: React.MouseEvent<Element, MouseEvent>,
    node: Node
  ) {
    switch (node.type) {
      case "endpointNode":
        // if node already active and clicked again, switch to append. (user want to add another node)
        if (mode.type === "edit-node" && mode.node.id === node.id) {
          setMode({ type: "append-node" });
        } else {
          setMode({ type: "edit-node", node: node });
        }
    }
  }
  return (
    <ModeProvider value={{ mode, setMode }}>
      <div className="flex-1 w-full flex items-center">
        <AsideMenu />
        <div className="flex-1 h-full">
          <ReactFlow
            nodeTypes={nodeTypes}
            nodes={nodes}
            edges={edges}
            onEdgeClick={(event, edge) => {
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
    </ModeProvider>
  );
}
