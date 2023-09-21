import ReactDOM from "react-dom/client";
import FlowBuilder from "./App.tsx";
import "../styles/index.css";
import "@fontsource-variable/open-sans";
import * as Sentry from "@sentry/react";
Sentry.init({
  dsn: import.meta.env.SENTRY_DSN,
  integrations: [
    new Sentry.BrowserTracing({
      tracePropagationTargets: ["localhost", "opencopilot.so"],
    }),
    new Sentry.Replay(),
    new Sentry.BrowserProfilingIntegration(),
  ],
  tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});
ReactDOM.createRoot(document.getElementById("root")!).render(<FlowBuilder />);
