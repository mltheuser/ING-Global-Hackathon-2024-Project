import Settle from "./components/contributions/settle/Settle";
import Scanner from "./components/scanner/Scanner";
import ReceiptEdit from "./components/scanner/receiptEdit/ReceiptEdit";
import ConsumptionOverview from "./components/consumption/ConsumptionOverview";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./globalVariables.css";

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