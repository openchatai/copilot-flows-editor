import { useEffect, useMemo, useState } from "react";
import type { Paths, Swagger, TransformedPath } from "./types/Swagger";
import { useReactFlow, type Node, MarkerType, Edge } from "reactflow";
import { genId } from "./utils/genId";
import { useMode } from "../stores/ModeProvider";
import { updateNodePositions } from "./utils/updateNodePosition";
import { Y } from "./consts";
import { DiscIcon, TrashIcon } from "@radix-ui/react-icons";

function useLoadEndpoints() {
  const [endpoints, setEndpoints] = useState<Swagger>();

  async function fetchEndpoints() {
    const _ = await fetch("/example-swagger.json");
    const data: Swagger = await _.json();
    setEndpoints(data);
  }
  useEffect(() => {
    fetchEndpoints();
  }, []);
  const paths = useMemo(
    () => transformPaths(endpoints?.paths ?? {}) ?? [],
    [endpoints]
  );
  return { paths };
}

function transformPaths(paths: Paths): TransformedPath[] {
  return Object.entries(paths).map(([path, pathItem]) => ({
    path,
    methods: Object.entries(pathItem)
      .filter(([, operation]) => Boolean(operation))
      .map(([method, operation]) => ({
        ...operation!,
        method: method.toUpperCase(),
        operationId: operation!.operationId || "",
      })),
  }));
}

export default function AsideMenu() {
  const { paths } = useLoadEndpoints();
  const { setNodes, getNodes, setEdges, getEdges } =
    useReactFlow<TransformedPath>();
  const nodes = getNodes();
  const { mode, setMode, reset } = useMode();

  function appendEndpoint(payload: TransformedPath) {
    const id = genId();
    const newNode: Node = {
      id: id,
      type: "endpointNode",
      data: payload,
      draggable: false,
      position: { x: 0, y: Y * nodes.length },
    };

    setNodes((nds) => updateNodePositions([...nds, newNode], Y));
    const previousNode = nodes?.[nodes.length - 1];
    if (previousNode) {
      setEdges((eds) =>
        eds.concat({
          id: id,
          target: previousNode.id,
          source: newNode.id,
          type: "endpointEdge",
          markerStart: {
            type: MarkerType.ArrowClosed,
          },
        })
      );
    }
  }

  function addNodeBetween(edge: Edge, newNodeData: TransformedPath) {
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
      data: newNodeData,
      draggable: false,
      position: {
        x: 0,
        y: (sourceNode.position.y + targetNode.position.y) / 2,
      }, // @todo - calculate the position
    };
    // put the new node in the middle of the two nodes that were connected (make sure the node is sorted in array too)
    const sourceIndex = nodes.findIndex((node) => node.id === sourceNode.id);
    const newNodes = nodes
      .slice(0, sourceIndex)
      .concat(newNode)
      .concat(nodes.slice(sourceIndex));

    const newEdges = [
      {
        id: genId(),
        source: sourceNode.id,
        target: newNode.id,
        type: "endpointEdge",
        markerStart: {
          type: MarkerType.ArrowClosed,
        },
      },
      {
        id: genId(),
        source: newNode.id,
        target: targetNode.id,
        type: "endpointEdge",
        markerStart: {
          type: MarkerType.ArrowClosed,
        },
      },
      {
        id: genId(),
        source: newNode.id,
        target: targetNode.id,
        type: "endpointEdge",
        markerStart: {
          type: MarkerType.ArrowClosed,
        },
      },
    ];
    setEdges((eds) => eds.concat(newEdges));
    setNodes(updateNodePositions(newNodes, Y));
    console.log(newNodes);
  }

  function deleteNode(node: Node<TransformedPath>) {
    const nodeIndex = nodes.findIndex((nd) => nd.id === node.id);
    const previousNode = nodes[nodeIndex - 1];
    const nextNode = nodes[nodeIndex + 1];
    const newNodes = nodes.filter((nd) => nd.id !== node.id);
    reset();
    setNodes(updateNodePositions(newNodes, Y));
    // reconnect edges the to before and after nodes

    const edges = getEdges();
    const allExceptConnectedEdges = edges.filter(
      (ed) => ed.source !== node.id && ed.target !== node.id
    );
    const newEdges = allExceptConnectedEdges.concat({
      id: genId(),
      source: nextNode?.id ?? "",
      target: previousNode?.id ?? "",
      type: "endpointEdge",
      markerStart: {
        type: MarkerType.ArrowClosed,
      },
    });
    setEdges(newEdges);
  }

  // TODO: separate button component for endpoint
  const isAdd = mode.type === "append-node" || mode.type === "add-node-between";
  const isEdit = mode.type === "edit-node";
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
                    <button
                      onClick={() => {
                        if (mode.type === "append-node") {
                          appendEndpoint(path);
                        } else if (mode.type === "add-node-between") {
                          addNodeBetween(mode.edge, path);
                          setMode({
                            type: "append-node",
                          });
                        }
                      }}
                      className="text-start h-full p-2 hover:bg-gray-100 transition-colors w-full"
                    >
                      <span className="text-black/80 text-lg font-medium block">
                        {path.path}
                      </span>
                      <span className="flex w-full items-center gap-1 mt-2">
                        {path.methods.map((method) => {
                          const color = (() => {
                            switch (method.method.toUpperCase()) {
                              case "GET":
                                return "bg-green-500";
                              case "POST":
                                return "bg-blue-500";
                              case "PUT":
                                return "bg-yellow-500";
                              case "DELETE":
                                return "bg-red-500";
                              default:
                                return "bg-gray-500";
                            }
                          })();
                          return (
                            <span
                              key={method.method}
                              className={
                                "text-center text-white text-xs font-semibold rounded py-1 px-2 " +
                                color
                              }
                            >
                              {method.method}
                            </span>
                          );
                        })}
                      </span>
                    </button>
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
              <p className="text-sm font-medium text-gray-700 mt-1">
                {mode.node.data.methods
                  .map((method) => method.method)
                  .join(", ")}
              </p>
            </div>
            <div className="text-base flex items-center gap-2 p-2">
              <button
                onClick={() => deleteNode(mode.node)}
                className="flex items-center gap-1 border-rose-500 active:opacity-80 transition-opacity text-rose-500 border rounded px-2 py-1"
              >
                <span>Delete</span>
                <TrashIcon />
              </button>
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
