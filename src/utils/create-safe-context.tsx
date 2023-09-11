import { createContext, useContext } from "react";

export function createSafeContext<DT>(defaultValue: DT) {
  const Context = createContext<DT>(defaultValue);
  const SafeProvider = Context.Provider;
  const useSafeContext = () => {
    const context = useContext(Context);
    if (context === undefined) {
      throw new Error("useSafeContext must be used within a SafeProvider");
    }
    return context;
  };
  return [SafeProvider, useSafeContext] as const;
}
