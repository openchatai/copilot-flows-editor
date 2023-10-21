import { createSafeContext } from "../utils/create-safe-context";
export type Settings = {
  standalone?: boolean;
  maxFlows?: number;
};

const [SettingsProvider, useSettings] = createSafeContext<Settings>(
  {} as Settings
);

export { SettingsProvider, useSettings };
