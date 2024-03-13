import React, { useState } from 'react';
import './ReceiptEdit.css';

function ReceiptEdit(props) {

    const [prevId, setPrevId] = useState(2)
    const getNextItemId = () => {
        const nextId = prevId + 1;
        setPrevId(() => nextId);
        return nextId;
    }

    const [items, setItems] = useState(props.receiptData.items.receipt);

    const createNewItem = () => {
        const newItem = { id: getNextItemId(), name: 'Name', price: 0.0, amount: 0 }
        setItems([...items, newItem]);
    }

    const deleteItem = (idToDelete) => {
        const newItemList = items.filter((item) => item.id !== idToDelete);
        setItems(() => newItemList);
    }

    const handleItemChange = (id, field, value) => {
        setItems((prevItems) =>
            prevItems.map((item) =>
                item.id === id ? { ...item, [field]: value } : item
            )
        );
    };

    //const handleAddItem = () {

    //}

    const calculateTotal = () => {
        return items.reduce((total, item) => total + item.price * item.amount, 0);
    };

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
                        <li>
                            <input
                                type="text"
                                value={item.name}
                                onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                            />
                            <div>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={item.price}
                                    onChange={(e) => handleItemChange(item.id, 'price', Math.max(0, parseFloat(e.target.value)))}
                                />
                                X
                                <input
                                    type="number"
                                    value={item.amount}
                                    onChange={(e) => handleItemChange(item.id, 'amount', Math.max(0, parseInt(e.target.value)))}
                                />
                                =
                                <div>
                                    <input
                                        type="number"
                                        value={calculateItemTotal(item.amount, item.price)}
                                        onChange={(e) => handleItemChange(item.id, 'amount', Math.max(0, parseInt(e.target.value)))}
                                    />
                                    <input type="image" src="../lock.svg" /></div>
                            </div>
                            <button onClick={() => deleteItem(item.id)}>Delete</button>
                            <p>

                            </p>
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