import Settle from "./components/contributions/settle/Settle";
import Scanner from "./components/scanner/Scanner";
import ReceiptEdit from "./components/scanner/receiptEdit/ReceiptEdit";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Scanner />} />
        <Route path="edit/:receiptId" element={<ReceiptEdit />} />
        <Route path="contribute/:receiptId" element={<Settle />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;