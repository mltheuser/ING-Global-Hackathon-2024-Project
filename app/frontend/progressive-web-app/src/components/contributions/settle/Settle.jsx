import React, { useEffect, useState } from "react";
import './Settle.css';
import ReceiptItem from "../receiptitem/ReceiptItem";
import axios from "axios";
import { useParams } from 'react-router-dom';

function Settle() {

    const { receiptId } = useParams();

    const [receiptData, setReceiptData] = useState([])
    async function loadReceiptData() {
        const res = await axios.get("http://localhost:8000/bill/" + receiptId + "/get");
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


    const calculateTotalCost = (itemStates) => {
        var totalContributionSum = 0
        for (const [_, state] of Object.entries(itemStates)) {
            totalContributionSum += state.currentContribution
        }
        return Number(totalContributionSum).toFixed(2)
    }

    function checkout() {
        axios.put("http://localhost:8000/bill/"+ receiptId +"/settle", JSON.stringify(itemStates), {
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    return (
        <div className="receipt-container">
            <h1>Settle the Score</h1>
            <div className="receipt-container">
                <ul className="receipt-items">
                    {receiptData.map((item, index) => (
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
            <div className="receipt-total">
                <span className="total-label">Total:</span>
                <span className="total-amount">{calculateTotalCost(itemStates)}</span>
            </div>
            <button onClick={() => checkout()} className="pay">Checkout</button>
        </div>
    );
}

export default Settle;