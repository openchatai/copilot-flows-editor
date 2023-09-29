import { GitHubLogoIcon, ResetIcon } from "@radix-ui/react-icons";
import { CodePreview, Controller, FlowArena, useController } from "../lib";

function Header() {
  const {
    reset,
    state: { activeFlowId, flows },
  } = useController();
  const activeFlow = flows.find((f) => f.id === activeFlowId);
  return (
    <header className="h-14 w-full bg-neutral-100">
      <div className="w-full h-full flex items-center justify-between lg:px-4 px-2">
        <div className="select-none align-middle flex items-center">
          <h1 className="text-slate-800 text-2xl font-bold">Flow Editor</h1>
          {activeFlow && (
            <>
              <span className="text-2xl font-bold mx-1">/</span>
              <span className="text-base tracking-tight">
                {activeFlow.name}
              </span>
            </>
          )}
        </div>
        <div className="right space-x-2">
          <button
            onClick={async () => {
              // confirm
              if (confirm("Are you sure you want to reset?")) {
                reset();
              }
            }}
            className="btn danger small"
          >
            <span>Reset</span>
            <ResetIcon className="inline-block ml-1" />
          </button>
          <a
            href="https://github.com/openchatai/copilot-flows-editor"
            className="text-lg p-2 inline rounded cursor-pointer font-medium"
          >
            <GitHubLogoIcon className="inline" />
          </a>
        </div>
      </div>
    </header>
  );
}

export default function FlowBuilder() {
  return (
    <Controller
      standalone
      initialState={{
        flows: [
          {
            id: "flow-1",
            name: "Flow 1",
            description: "This is a flow",
            createdAt: Date.now(),
            steps: [],
          },
        ],
        paths: [],
      }}
      onChange={(state) => {
        console.log(state);
      }}
    >
      <div className="h-screen flex items-start flex-col font-openSans overflow-hidden">
        <Header />
        <div className="flex items-start justify-between relative w-full flex-1 overflow-hidden">
          <FlowArena />
          <CodePreview />
        </div>
      </div>
    </Controller>
  );
}
