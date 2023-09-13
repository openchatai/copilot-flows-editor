import { useMode } from "../stores/ModeProvider";
import { DiscIcon } from "@radix-ui/react-icons";
import { useLoadEndpoints } from "./useLoadEndpoints";
import { PathButton } from "./PathButton";

export default function AsideMenu() {
  const { paths } = useLoadEndpoints();
  const { mode, isAdd, isEdit } = useMode();
  console.log(mode);
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
