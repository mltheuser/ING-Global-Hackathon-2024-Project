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
        <Route path="contribute" element={<ReceiptEdit receiptData={{items: [{amount: 2, price: 10.25, name: "A", totalPrice: 20.50}]}}/>} />
        <Route path="contribute/:receiptId" element={<ReceiptEdit />} />
        <Route path="consumption" element={<ConsumptionOverview />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;