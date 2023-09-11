import { useEffect, useState } from "react";
import type { Paths, Swagger, TransformedPath } from "./types/Swagger";
import { useActiveNode } from "./activeNodeProvider";
import { useReactFlow, type Node, MarkerType, Edge } from "reactflow";
import { genId } from "./utils/genId";
import { useMode } from "../stores/ModeProvider";
import { updateNodePositions } from "./utils/updateNodePosition";
import { Y } from "./consts";

function transformPaths(paths: Paths): TransformedPath[] {
  return Object.entries(paths).map(([path, pathItem]) => ({
    path,
    methods: Object.entries(pathItem)
      .filter(([, operation]) => Boolean(operation))
      .map(([method, operation]) => ({
        ...operation!,
        method: method.toUpperCase(),
      })),
  }));
}

export default function AsideMenu() {
  const [endpoints, setEndpoints] = useState<Swagger>();
  const { setNodes, getNodes, setEdges } = useReactFlow();
  const nodes = getNodes();
  const { mode, setMode } = useMode();
  function appendEndpoint(payload: TransformedPath) {
    const id = genId();
    const newNode: Node = {
      id: id,
      type: "endpointNode",
      data: payload,
      draggable: false,
      position: { x: 0, y: 120 * nodes.length },
    };
    setNodes((nds) => [...nds, newNode]);
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
      },
      {
        id: genId(),
        source: newNode.id,
        target: targetNode.id,
        type: "endpointEdge",
      },
      {
        id: genId(),
        source: newNode.id,
        target: targetNode.id,
        type: "endpointEdge",
      },
    ];
    setEdges((eds) => eds.concat(newEdges));
    setNodes(updateNodePositions(newNodes, Y));
    console.log(newNodes);
  }
  async function fetchEndpoints() {
    const _ = await fetch("/example-swagger.json");
    const data: Swagger = await _.json();
    setEndpoints(data);
  }
  useEffect(() => {
    fetchEndpoints();
  }, []);
  const paths = transformPaths(endpoints?.paths ?? {});
  // TODO: separate button component for endpoint
  return (
    <aside className="h-full max-w-sm w-full bg-white z-50 shadow-lg py-2">
      <div
        data-container="select-node"
        className="w-full h-full flex items-start flex-col [&>*]:w-full gap-5"
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
            {endpoints?.paths && (
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
      <div className="w-full h-full" data-container="edit-node" hidden>
        Edit Node
      </div>
    </aside>
  );
}
