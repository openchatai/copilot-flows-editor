import { BrowserRouter, Route, Routes } from "react-router-dom";
import FlowBuilder from "./pages/FlowBuilder";
import "@fontsource-variable/open-sans";
import { Explorer } from "./pages/Explorer";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route Component={FlowBuilder} path="/edit/:id" />
        <Route Component={Explorer} path="/" />
      </Routes>
    </BrowserRouter>
  );
}
