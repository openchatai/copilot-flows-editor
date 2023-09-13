import type { NodeData, TransformedPath } from "./types/Swagger";
import { useReactFlow, type Node, Edge } from "reactflow";
import { genId } from "./utils/genId";
import { useMode } from "../stores/ModeProvider";
import { updateNodePositions } from "./utils/updateNodePosition";
import { Y } from "./consts";
import { DiscIcon } from "@radix-ui/react-icons";
import { useLoadEndpoints } from "./useLoadEndpoints";
import { MethodBtn } from "./MethodRenderer";

function PathButton({ path }: { path: TransformedPath }) {
  const { mode, reset } = useMode();
  const { setNodes, getNodes, setEdges } = useReactFlow<NodeData>();
  const nodes = getNodes();
  function appendNode(payload: NodeData) {
    const id = genId();
    const newNode: Node = {
      id: id,
      type: "endpointNode",
      data: payload,
      draggable: false,
      position: { x: 0, y: Y * nodes.length },
    };

    setNodes((nds) => updateNodePositions([...nds, newNode], Y));
  }

  function addNodeBetween(edge: Edge, payload: NodeData) {
    const targetNode = nodes.find((node) => node.id === edge.target);
    const sourceNode = nodes.find((node) => node.id === edge.source);
    if (!targetNode || !sourceNode) {
      return;
    }
    // delete the edge
    setEdges((eds) => eds.filter((ed) => ed.id !== edge.id));
    // add the new node
    const id = genId();
    const newNode: Node = {
      id: id,
      type: "endpointNode",
      data: payload,
      draggable: false,
      position: {
        x: 0,
        y: (sourceNode.position.y + targetNode.position.y) / 2,
      },
    };
    // put the new node in the middle of the two nodes that were connected (make sure the node is sorted in array too)
    const sourceIndex = nodes.findIndex((node) => node.id === sourceNode.id);
    const newNodes = nodes
      .slice(0, sourceIndex)
      .concat(newNode)
      .concat(nodes.slice(sourceIndex));
    setNodes(updateNodePositions(newNodes, Y));
  }

  return (
    <div>
      <div className="text-start h-full p-2 hover:bg-gray-100 transition-colors w-full">
        <span className="text-black/80 text-lg font-medium">{path.path}</span>
        <span className="flex w-full items-center gap-1 mt-2">
          {path.methods.map((method) => {
            return (
              <MethodBtn
                key={method.method}
                method={method.method}
                onClick={() => {
                  const newNode: NodeData = {
                    ...path,
                    ...method,
                  };
                  if (mode.type === "append-node") {
                    appendNode(newNode);
                  } else if (mode.type === "add-node-between") {
                    addNodeBetween(mode.edge, newNode);
                    reset();
                  }
                }}
              >
                {method.method}
              </MethodBtn>
            );
          })}
        </span>
      </div>
    </div>
  );
}

export default function AsideMenu() {
  const { paths } = useLoadEndpoints();
  const { mode, isAdd, isEdit } = useMode();

  // TODO: separate button component for endpoint

  return (
    <aside className="h-full max-w-sm w-full bg-white shadow-lg py-2">
      <div
        data-container="select-node"
        data-hidden={!isAdd}
        className="w-full h-full flex items-start flex-col data-[hidden=true]:hidden data-[hidden=true]:animate-out data-[hidden=true]:slide-out-to-left-full animate-in [&>*]:w-full gap-5"
      >
        <div className="p-2">
          <h2 className="text-xl font-semibold text-slate-700">
            Raw Endpoints
          </h2>
          <p className="text-sm font-medium text-gray-700 mt-1">
            Select an endpoint to add to the flow. You can edit the endpoint
          </p>
        </div>
        <div className="flex-1">
          <ul className="space-y-1 select-none">
            {paths && paths.length > 0 && (
              <>
                {paths.map((path) => (
                  <li key={path.path} className="w-full">
                    <PathButton path={path} />
                  </li>
                ))}
              </>
            )}
          </ul>
        </div>
      </div>
      <div
        className="w-full h-full flex items-start flex-col data-[hidden=true]:animate-out animate-in data-[hidden=true]:hidden data-[hidden=true]:slide-out-to-right-full"
        data-container="edit-node"
        data-hidden={!isEdit}
      >
        <div className="p-2 w-full">
          <h2 className="text-xl font-semibold text-slate-700">
            Edit Endpoint
          </h2>
          <p className="text-sm font-medium text-gray-700 mt-1">
            Edit the endpoint you selected
          </p>
        </div>
        {mode.type === "edit-node" && (
          <>
            <div className="p-2 flex-1 w-fullw">
              <h3 className="text-lg font-semibold text-slate-700">
                {mode.node.data.path}
              </h3>
            </div>
            <div className="text-base flex items-center gap-2 p-2">
              <button className="flex items-center gap-1 bg-indigo-500 active:opacity-80 transition-opacity text-white px-2 py-1 rounded">
                <span>Save</span>
                <DiscIcon />
              </button>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
