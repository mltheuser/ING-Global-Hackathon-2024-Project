import ReceiptEdit from "./components/ReceiptEdit";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route index element={<ReceiptEdit />} />
      <Route path="contribute/:receiptId" element={<ReceiptEdit />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;