import { useMode } from "../stores/ModeProvider";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useLoadEndpoints } from "./useLoadEndpoints";
import { PathButton } from "./PathButton";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useMemo, useState } from "react";
import { MethodBtn } from "./MethodRenderer";
import cn from "../../utils/cn";
export default function AsideMenu() {
  const { paths } = useLoadEndpoints();
  const { mode, isAdd, setMode, isEdit, isIdle } = useMode();
  const [search, setSearch] = useState("");
  const renderedPaths = useMemo(
    () =>
      search.trim().length > 0
        ? paths.filter((path) => path.path.includes(search.trim()))
        : paths,
    [search, paths]
  );
  function setIdle() {
    setMode({ type: "idle" });
  }
  return (
    <aside
      className={cn(
        "h-full max-h-full overflow-hidden origin-left bg-white border-r-4 border-neutral-100 shadow-lg py-2",
        isIdle ? "w-0 animate-in" : "max-w-sm w-full animate-out transition-all duration-200 ease-in-out"
      )}
    >
      <div
        data-container="select-node"
        data-hidden={!isAdd}
        className="w-full h-full max-h-full overflow-hidden flex items-start flex-col data-[hidden=true]:hidden data-[hidden=true]:animate-out data-[hidden=true]:slide-out-to-left-full animate-in [&>*]:w-full gap-5"
      >
        <div className="px-4 pt-4 flex items-center">
          <h1 className="text-base font-semibold flex-1 text-slate-800">
            Select Step
          </h1>
          <button className="text-lg" onClick={setIdle}>
            <Cross2Icon />
          </button>
        </div>
        <div className="w-full px-4">
          <div className="flex items-center border border-black/50 rounded overflow-hidden focus-within:ring-1 ring-indigo-500">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="flex-1 border-stone-500 p-2 outline-none text-slate-700"
            />
            <span className="p-2 text-2xl text-stone-500">
              <MagnifyingGlassIcon />
            </span>
          </div>
        </div>
        <div className="flex-1 px-4 overflow-auto">
          <ul className="space-y-1 select-none h-fit">
            {renderedPaths.length > 0 ? (
              <>
                {renderedPaths.map((path) => (
                  <li key={path.path} className="w-full">
                    <PathButton path={path} />
                  </li>
                ))}
              </>
            ) : (
              <div className="w-full p-5 text-center text-2xl text-stone-500">
                <span>¯\_(ツ)_/¯</span>
              </div>
            )}
          </ul>
        </div>
      </div>
      <div
        className="w-full h-full flex pt-4 items-start flex-col data-[hidden=true]:animate-out animate-in data-[hidden=true]:hidden data-[hidden=true]:slide-out-to-right-full"
        data-container="edit-node"
        data-hidden={!isEdit}
      >
        <div className="px-4 flex items-center justify-end w-full">
          <button onClick={setIdle}>
            <Cross2Icon />
          </button>
        </div>
        {mode.type === "edit-node" && (
          <div className="px-4 space-y-2">
            <div className="w-full">
              <h1 className="text-xl font-semibold text-slate-800 space-x-1">
                <code>{mode.node.data.path}</code>
                <MethodBtn
                  method={mode.node.data.method}
                  className="pointer-events-none inline text-xs"
                >
                  {mode.node.data.method}
                </MethodBtn>
              </h1>
            </div>
            <div>
              {mode.node.data.tags?.map((t) => (
                <span className="text-sm">#{t}</span>
              ))}
            </div>
            <div className="p-2 flex-1 w-full">
              <p>{mode.node.data.description}</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
