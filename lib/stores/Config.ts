import { createSafeContext } from "../utils/create-safe-context";
import type { Settings } from "../types/Config";
const [SettingsProvider, useSettings] = createSafeContext<Settings>(
  {} as Settings
);

export { SettingsProvider, useSettings };
