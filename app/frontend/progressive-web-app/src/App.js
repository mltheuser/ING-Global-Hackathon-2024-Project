import Settle from "./components/contributions/settle/Settle";
import Scanner from "./components/scanner/Scanner";
import ReceiptEdit from "./components/scanner/receiptEdit/ReceiptEdit";
import ConsumptionOverview from "./components/consumption/ConsumptionOverview";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./globalVariables.css";
import ShareLink from "./components/scanner/receiptEdit/ShareLink";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Scanner />} />
        <Route path="edit/:receiptId" element={<ReceiptEdit />} />
        <Route path="contribute/:receiptId" element={<Settle />} />
        <Route path="share" element={<ShareLink />} />
        <Route path="contribute" element={<ReceiptEdit receiptData={{items: [{amount: 2, price: 10.25, name: "A", totalPrice: 20.50}]}}/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;