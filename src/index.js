import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Forma from "./forma";
import Prikaz from "./prikaz";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Forma />} />
        <Route path="/prikaz" element={<Prikaz />} />
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
