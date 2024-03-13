import Scanner from "./components/scanner/Scanner";
import ReceiptEdit from "./components/scanner/receiptEdit/ReceiptEdit";
import ConsumptionOverview from "./components/consumption/ConsumptionOverview";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Scanner />} />
        <Route path="contribute/:receiptId" element={<ReceiptEdit />} />
        <Route path="consumption" element={<ConsumptionOverview />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;