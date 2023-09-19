import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "../Dialog";
import { ChevronRightIcon, CubeIcon, PlusIcon } from "@radix-ui/react-icons";
import cn from "../../utils/cn";

export function FlowsList() {
  const [flowsPanelOpened, setFlowsPanel] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <div className="block absolute transition bottom-0 inset-x-0 bg-white shadow-lg">
      <div className="flex items-center justify-between border-y-4 border-neutral-100 px-2 py-1">
        <button
          className="flex-1 space-x-2 text-sm uppercase text-start font-semibold"
          onClick={() => setFlowsPanel((pre) => !pre)}
        >
          <ChevronRightIcon
            className={cn(
              "text-base inline transition-transform",
              flowsPanelOpened ? "rotate-0" : "rotate-90"
            )}
          />
          <span>flows</span>
        </button>
        <Dialog open={modalOpen} onOpenChange={(e) => setModalOpen(e)}>
          <DialogContent className="h-fit">
            <DialogHeader className="text-lg font-semibold">
              New Flow
            </DialogHeader>
            <form>
              <label htmlFor="name-input">Name</label>
              <input
                required
                id="name-input"
                defaultValue={"New Flow"}
                className="block text-sm font-medium rounded border border-stone-300 w-full p-2 text-stone-800 mb-4"
                type="text"
                name="name"
              />
              <label htmlFor="name-input">Description</label>
              <input
                required
                defaultValue={"A flow that does something"}
                id="description-input"
                className="block text-sm font-medium rounded border border-stone-300 w-full p-2 text-stone-800"
                type="text"
                name="description"
              />
              <div className="w-full flex items-center justify-end mt-4">
                <button
                  type="submit"
                  className="px-2 py-1 rounded text-base font-semibold bg-indigo-500 text-white"
                >
                  Create
                </button>
              </div>
            </form>
          </DialogContent>
          <DialogTrigger asChild>
            <button>
              <PlusIcon className="text-base" />
            </button>
          </DialogTrigger>
        </Dialog>
      </div>
      <div
        className={cn(
          "block transition-transform",
          flowsPanelOpened ? "scale-y-100 h-52" : "scale-y-0 h-0"
        )}
      >
        <ul className="space-y-1 divide-y [&_>li]:p-2">
          <li>
            <button className="space-x-2 text-base">
              <CubeIcon className="inline" />
              <span>Flow 1</span>
            </button>
          </li>
          <li>
            <button className="space-x-2 text-base">
              <CubeIcon className="inline" />
              <span>Flow 1</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
