import Scanner from "./components/scanner/Scanner";
import ReceiptEdit from "./components/scanner/receiptEdit/ReceiptEdit";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Scanner />} />
        <Route path="contribute/:receiptId" element={<ReceiptEdit />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;