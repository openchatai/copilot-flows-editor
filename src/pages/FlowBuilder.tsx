import { FlowArena } from "../components/FlowBuilder/FlowArena";
import { ReactFlowProvider } from "reactflow";
import { CodePreview } from "../components/CodePreview";
import { ModeProvider } from "../components/stores/ModeProvider";
import { PathsProvider } from "../components/stores/PathsProvider";
import { Controller } from "../components/stores/Controller";

export default function FlowBuilder() {
  return (
    <Controller>
      <PathsProvider>
        <ModeProvider>
          <ReactFlowProvider>
            <div className="w-full h-screen relative flex items-start flex-col font-openSans overflow-hidden">
              <header className="h-14 w-full bg-neutral-100">
                <div className="w-full h-full flex items-center justify-between px-2">
                  <div className="middle">
                    <h1 className="text-xl font-bold text-slate-800">
                      Flow Editor
                    </h1>
                  </div>
                  <div className="right space-x-2">
                    <button className="text-sm px-2 py-1 text-white font-medium rounded bg-indigo-500">
                      save
                    </button>
                  </div>
                </div>
              </header>
              <div className="flex items-start justify-between w-full flex-1 overflow-hidden">
                <FlowArena />
                <CodePreview />
              </div>
            </div>
          </ReactFlowProvider>
        </ModeProvider>
      </PathsProvider>
    </Controller>
  );
}
