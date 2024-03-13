// const [items, setItems] = useState(props.receiptData.items.receipt);
import React, { useState } from 'react';
import './ReceiptEdit.css';

function ReceiptEdit(props) {
    // Data  
    const [receiptTotal, setReceiptTotal] = useState(35.00);
    const [items, setItems] = useState(props.receiptData.items.receipt)
    const [prevId, setPrevId] = useState(2)
    const getNextItemId = () => {
        const nextId = prevId + 1;
        setPrevId(() => nextId);
        return nextId;
    }

    // Utils

    const calculateTotal = () => {
        return items.reduce((total, item) => total + item.price * item.amount, 0);

    };

    // Validity check input data
    const isValidItem = (item) => {
        return item.amount * item.price == item.totalPrice;
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
        if (field == 'price') {
            setItems(
                (prevItems) => prevItems.map(
                        (item) =>
                item.id === id ? { ...item, ['price']: value} : item
            )
        );
        } else if (field == 'totalPrice') {
            setItems(
                (prevItems) => prevItems.map(
                        (item) =>
                item.id === id ? { ...item, ['totalPrice']: value} : item
            )
            );
        } else if (field == 'amount'){
            setItems(
                (prevItems) => prevItems.map(
                        (item) =>
                item.id === id ? { ...item, ['amount']: value} : item
            )
            );
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
            <ul cassName="receipt-items">

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

                                <div>
                                <input
                                    type="number"
                                    value={item.totalPrice}
                                    onChange={(e) => handleItemChange(item.id, 'totalPrice', Math.max(0, parseInt(e.target.value)))}
                                />
                            </div>
                            </div>
                            <button onClick={() => deleteItem(item.id)}>Delete</button>
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