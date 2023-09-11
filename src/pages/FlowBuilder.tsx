import FlowBuilder from "../components/FlowBuilder/Builder";
import { Link } from "react-router-dom";
import { ChevronLeftIcon } from "@radix-ui/react-icons";
import { ReactFlowProvider } from "reactflow";
function Header() {
  return (
    <header className="h-14 w-full bg-neutral-100">
      <div className="w-full h-full flex items-center justify-between container px-2">
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="text-2xl rounded-full p-2 hover:bg-gray-300 transition-colors text-black"
          >
            <ChevronLeftIcon />
          </Link>
          <div className="left text-black/80 text-xl font-medium">
            <span>untitled-flow</span>
          </div>
        </div>
        <div className="middle">
          <h1 className="text-xl font-bold text-black">Flow Editor</h1>
        </div>
        <div className="right">
          <button className="p-2 hover:bg-black/20 text-gray-500 hover:text-gray-800 rounded transition text-base font-semibold border-gray-300 hover:border-transparent border">
            Show Code
          </button>
        </div>
      </div>
    </header>
  );
}

export default function FlowBuilderPage() {
  return (
    <ReactFlowProvider>
      <div className="w-full h-screen relative flex items-start flex-col">
        <Header />
        <FlowBuilder />
      </div>
    </ReactFlowProvider>
  );
}
