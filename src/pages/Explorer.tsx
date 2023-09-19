import { CubeIcon, PlusIcon } from "@radix-ui/react-icons";
import { useLocalStorage } from "../hooks/use-storage";
import { LS_KEY } from "../constants";
import { genId } from "../components/FlowBuilder/utils/genId";
import { FormEvent, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "../components/Dialog";

export type FlowType = {
  id: string;
  name: string;
  description: string;
  steps: [];
};
export function Explorer() {
  const [flows, setFlows] = useLocalStorage<FlowType[]>({
    key: LS_KEY,
    initialValue: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const onSubmit = (evnet: FormEvent) => {
    evnet.preventDefault();
    const data = Object.fromEntries(
      new FormData(evnet.target as HTMLFormElement)
    ) as {
      name: string;
      description: string;
    };
    const newFlow: FlowType = {
      id: genId(),
      steps: [],
      ...data,
    };
    setFlows([...flows, newFlow]);
    setModalOpen(false);
  };
  function removeFlow(id: string) {
    setFlows(flows.filter((flow) => flow.id !== id));
  }
  return (
    <div className="w-screen h-screen flex items-center justify-center p-5">
      <div className="w-full max-w-2xl rounded shadow-lg bg-zinc-50 border border-stone-300 max-h-full min-h-60 h-fit">
        <div className="p-5">
          <header className="flex items-center justify-between mb-5">
            <div>
              <h1 className="text-xl font-medium tracking-normal flex items-center gap-1">
                <CubeIcon className="text-indigo-700" />
                <span>All flows</span>
              </h1>
            </div>
            <div>
              <Dialog open={modalOpen} onOpenChange={(e) => setModalOpen(e)}>
                <DialogContent className="h-fit">
                  <DialogHeader className="text-lg font-semibold">
                    New Flow
                  </DialogHeader>
                  <form onSubmit={onSubmit}>
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
                  <button className="flex items-center gap-1 text-sm px-2 py-1 bg-gradient-to-tr from-indigo-500 to-indigo-700 text-white rounded">
                    <span>New Flow</span>
                    <PlusIcon className="text-sm" />
                  </button>
                </DialogTrigger>
              </Dialog>
            </div>
          </header>
          <div className="w-full overflow-auto max-w-full">
            <table className="w-full [&_th]:p-2 [&_td]:p-2 min-w-fit [&_tr]:whitespace-nowrap [&_tr]:border-b table table-auto">
              <thead>
                <tr>
                  <th className="text-left text-base font-medium text-stone-500">
                    Name
                  </th>
                  <th className="text-left text-base font-medium text-stone-500">
                    Description
                  </th>
                  <th className="text-left text-base font-medium text-stone-500"></th>
                </tr>
              </thead>
              <tbody>
                {flows && flows.length > 0 ? (
                  flows.map((flow, i) => (
                    <tr key={i} className="animate-in fade-in">
                      <td className="text-base font-medium text-slate-800">
                        {flow.name}
                      </td>
                      <td className="text-base font-medium text-slate-800">
                        {flow.description}
                      </td>
                      <td className="space-x-2">
                        <button
                          className="btn !text-rose-500"
                          onClick={() => removeFlow(flow.id)}
                        >
                          delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="border-none">
                    <td colSpan={3} className="text-center text-xl p-5">
                      ¯\_(ツ)_/¯
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
