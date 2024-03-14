import React, { useEffect, useState } from "react";
import './Settle.css';
import ReceiptItem from "../receiptitem/ReceiptItem";

function Settle() {
    const receiptData = {
        items: [
            { name: "A", amount: 10, totalPrice: 12.5 },
            { name: "B", amount: 5, totalPrice: 7.5 },
        ],
    };

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
                {receiptData &&
                    receiptData.items.map((item, index) => (
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