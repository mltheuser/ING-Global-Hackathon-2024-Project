import React, { useState } from 'react';
import CurrencyInput from 'react-currency-input-field';
import './ReceiptEdit.css';
import axios from "axios";

function ReceiptEdit(props) {
    // Data 
    const [receiptTotal, setReceiptTotal] = useState(35.00);

    // const [items, setItems] = useState(props.receiptData.items);
    const [items, setItems] = useState([
        { id: 1, name: 'Item 1', amount: 1, price: 10.0, totalPrice: 2 },
        { id: 2, name: 'Item 2', amount: 2, price: 15.0, totalPrice: 1 },
    ]);
    // Utils
    const calculateTotal = () => {
        return items.reduce((total, item) => total + item.price * item.amount, 0);
    };
    // Validity check input data
    const isValidItem = (item) => {
        return Number(item.amount * item.price).toFixed(2) === item.totalPrice;
    }
    
    const isValidTotal = () => {
        const calculatedTotal = calculateTotal();
        return calculatedTotal.toFixed(2) == receiptTotal.toFixed(2);
    }
    // Item
    const createNewItem = () => { 
        const newItem = { name: 'Name', price: 0.0, amount:0, totalPrice: 0.0, lockedAmount: false }
        setItems([...items, newItem]);
    }
    
    const deleteItem = (idToDelete) => {
        const newItemList = items.filter((item) =>(item.id !== idToDelete));
        setItems(() => newItemList);
    }

    const handleItemChange = (id, field, value) => { 
        const updateField = (id, field, value) => {
            setItems(
                () => items.map(
                     (item) => item.id === id ? { ...item, [field]: value} : item
                )
            );
        }
        if (field == 'price' || field == 'totalPrice' || field == 'amount' || field == 'name') {
            updateField(id, field, value)
        } else {
            console.error("Bad field");
        }
    }

    // TODO: don't hardcode backend address
    async function checkout() {
        const dataToRequestJSON = (requestItems, total) => {
            const bills = []
            for (const item of requestItems) {
                const new_item = {
                    "id": item.id, 
                    "name": item.name, 
                    "price": item.price, 
                    "amount": item.amount, 
                    "totalPrice": item.totalPrice
                }
                bills.push(new_item)
            }
            console.log(bills)
            return {
                "bill": bills, 
                "total": total
            }
        }

        const requestJSON = dataToRequestJSON(items, receiptTotal)

        var data = new FormData()
        const jsondata = {"bill": [{"id": 1, "name": "donuts", "price": 3.0, "amount": 2, "total_price": 9.0}], "total": 20}
        data.append("json", JSON.stringify(jsondata))
        // JSON.stringify( '{"bill": [{"id": 1, "name": "donuts", "price": 3.0, "amount": 2, "total_price": 9.0}], "total": 20}' )


        const imageResponse = await axios.post('http://localhost:8080/bill/generate-link', JSON.stringify(jsondata), {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
        console.log(imageResponse)
        console.log(imageResponse.json())
    }
                        
    const [isImageExpanded, setIsImageExpanded] = useState(false);
                        
    const handleImageClick = () => {
        setIsImageExpanded(!isImageExpanded);
    };
    
    const calculateItemTotal = (amount, price) => {
        return amount * price;
    };

    
    return (
    <div className="receipt-container">
        <h1>Digital Receipt</h1>
        <div className={`receipt-image-container ${isImageExpanded ? 'expanded' : ''}`} onClick={handleImageClick}>
            <img src="https://discuss.poynt.net/uploads/default/original/2X/6/60c4199364474569561cba359d486e6c69ae8cba.jpeg" alt="Original Receipt" className="original-receipt" />
            <div className="expand-icon">&#x2922;</div>
        </div>
        <ul className="receipt-items">
            {items && items.map((item, index) => (
            <React.Fragment key={index}>
                <li className={isValidItem(item) ? '' : 'invalid'}>
                    <input
                        type="text"
                        value={item.name}
                        onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                    />
                    <div><CurrencyInput
                            name="price"
                            prefix="€"
                            placeholder="Price per item"
                            defaultValue={item.price}
                            decimalScale={2}
                            maxLength={8}
                            onValueChange={(value, name, _) => handleItemChange(item.id, name,  Number(value).toFixed(2))}
                        />
                        X
                        <input 
                            type="number"
                            step="1"
                            value={item.amount}
                            onChange={(e) => handleItemChange(item.id, 'amount', Math.max(0, (e.target.value)))}
                        />
                        =
                        <CurrencyInput
                            name="totalPrice"
                            prefix="€"
                            placeholder="Total amount"
                            defaultValue={item.totalPrice}
                            decimalScale={2}
                            onValueChange={(value, name, _) => handleItemChange(item.id, name,  Number(value).toFixed(2))}
                            // onValueChange={(_, name, _) => handleItemChange(item.id, name, Math.max(0, parseInt(e.target.value)))}
                        />
                        <button onClick={() => deleteItem(item.id)}>Delete</button>
                    </div>

                </li>
            {index !== items.length - 1 && <hr className="item-separator" />}
            </React.Fragment>            
        ))}
        <button onClick={() => createNewItem()}>Add item</button>
        </ul>
        <div className="receipt-total">
            <span className="total-label">Total:</span>
            <span className="total-amount">${calculateTotal().toFixed(2)}</span>
        </div>
        <button onClick={() => checkout()} className="checkout-button">Share</button>
    </div>
    );
}

export default ReceiptEdit;
