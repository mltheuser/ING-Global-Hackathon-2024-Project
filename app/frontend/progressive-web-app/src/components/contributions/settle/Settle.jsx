import React, { useEffect, useState } from "react";
import './Settle.css';
import ReceiptItem from "../receiptitem/ReceiptItem";
import axios from "axios";

function Settle() {
    const [bill_uuid, _] = useState("cf087d8a-7504-480e-a4ba-ccc873f5d1e7");
    const [receiptData, setReceiptData] = useState([])
    async function loadReceiptData() {
        const res = await axios.get("http://localhost:8000/bill/"+bill_uuid+"/get");
        const bill = JSON.parse(JSON.stringify(res.data.bill))
        var receiptData = bill.items.map((item) => {
            return {
                id: item.id,
                name: item.name,
                amount: item.amount,
                totalPrice: item.totalPrice
            }
        })
        setReceiptData(receiptData)
    }
    
    useEffect(() => {
        loadReceiptData()
    }, []);

    async function put_request(path, json_data) {
        var data = new FormData()
        data.append("json", JSON.stringify(json_data))
    
        const response = await axios.put(path, JSON.stringify(json_data), {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
    }


    const options = { forceIsCustomContribution: false };

    const [itemStates, setItemStates] = useState({});

    const handleItemStateChange = (index, state) => {
        setItemStates((prevStates) => ({
            ...prevStates,
            [index]: state,
        }));
    };

    useEffect(() => {
        console.log("Current item states:", itemStates);
    }, [itemStates]);

    return (
        <div className="receipt-container">
            <ul className="receipt-items">
                { receiptData.map((item, index) => (
                        <li key={index}>
                            <ReceiptItem
                                item={item}
                                options={options}
                                onStateChange={(state) => handleItemStateChange(index, state)}
                            />
                        </li>
                    ))}
            </ul>
        </div>
    );
}

export default Settle;