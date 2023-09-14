import { BrowserRouter, Route, Routes } from "react-router-dom";
import Validator from "./pages/Validator";
import FlowBuilder from "./pages/FlowBuilder";
import "@fontsource-variable/open-sans";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Validator />} />
        <Route path="/flow" element={<FlowBuilder />} />
      </Routes>
    </BrowserRouter>
  );
}
