import React, { useState } from 'react';
import './ReceiptEdit.css';
import Spinner from './Spinner';
import { useParams } from "react-router-dom"

function ReceiptEdit() {

    const [prevId, setPrevId] = useState(2)
    const getNextItemId = () => {
        const nextId = prevId + 1;
        setPrevId(() => nextId);
        return nextId;
    }

    const [items, setItems] = useState([
        { id: 0, name: 'Item 1', price: 10.0, amount: 2 },
        { id: 1, name: 'Item 2', price: 15.0, amount: 1 },
    ]);

const createNewItem = () => {
        const newItem = { id: getNextItemId(), name: 'Name', price: 0.0, amount:0 }
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

    const [isLoading, setIsLoading] = useState(false);

    const handleShareButtonClick = async () => {
        setIsLoading(true);

        try {
            // Perform the async operation here
            await new Promise(r => setTimeout(r, 10000));
        } catch (error) {
            // Handle any errors
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

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

    if (isLoading) {
        return (
            <div className="loading-page">
                <Spinner />
            </div>
        );
    }

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
                {items.map((item, index) => (
                    <React.Fragment key={item.id}>
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
                                <input type="image" src="../lock.svg"/></div>
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
            <button className="checkout-button" onClick={handleShareButtonClick}>Share</button>
        </div>
    );
}

export default ReceiptEdit;