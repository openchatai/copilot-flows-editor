import FlowArena from "../components/FlowBuilder/FlowArena";
import { ChevronLeftIcon } from "@radix-ui/react-icons";
import { ReactFlowProvider } from "reactflow";
import { CodePreview } from "./CodePreview";

export default function FlowBuilderPage() {
  return (
    <ReactFlowProvider>
      <div className="w-full h-screen relative flex items-start flex-col font-openSans overflow-hidden">
        <header className="h-14 w-full bg-neutral-100">
          <div className="w-full h-full flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <button className="text-2xl rounded-full p-2 hover:bg-gray-300 transition-colors text-black">
                <ChevronLeftIcon />
              </button>
              <div className="left text-slate-700 text-xl font-semibold">
                <span>untitled-flow</span>
              </div>
            </div>
            <div className="middle">
              <h1 className="text-xl font-bold text-slate-800">Flow Editor</h1>
            </div>
            <div className="right">

            </div>
          </div>
        </header>
        <div className="flex items-start justify-between w-full flex-1 overflow-hidden">
          <FlowArena />
          <CodePreview />
        </div>
      </div>
    </ReactFlowProvider>
  );
}
