import React, { useState } from 'react';
import CurrencyInput from 'react-currency-input-field';
import './ReceiptEdit.css';

function ReceiptEdit(props) {
    // Utils
    const [prevId, setPrevId] = useState(0)
    const getNextItemId = () => {
        const nextId = prevId + 1;
        setPrevId(() => nextId);
        return nextId;
    }
    
    // Data 
    const [receiptTotal, setReceiptTotal] = useState(35.00);

    // TODO: enable and integrate scanner output with date
    // const [scannerOutput, setScannerOutput] = useState(props.receiptData.items.receipt)

    const getParsedItems = () =>  {
        const items = [
            { id: prevId + 1, name: 'donuts', price: 3.0, amount:2, totalPrice: 9.0},
            { id: prevId + 2, name: 'beer 0.0', price: 2.5, amount:5, totalPrice: 12.5}
        ]
        setPrevId(prevId + 2)
        return items
    }
    const [items, setItems] = useState(getParsedItems)

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
        const newItem = { id: getNextItemId(), name: 'Name', price: 0.0, amount:0, totalPrice: 0.0, lockedAmount: false }
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
            <li>
                <b>Item name</b>
                <b>Amount</b>
                <b>Quantity</b>
            </li>
            
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
        <button className="checkout-button">Share</button>
    </div>
    );
}

export default ReceiptEdit;
