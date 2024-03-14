import React, { useState } from 'react';
import CurrencyInput from 'react-currency-input-field';
import './ReceiptEdit.css';
import BackButton from '../../../icons/Chevron_left_outline_orange_RGB.png'
import SettingsButton from '../../../icons/Large-Setting_outline_orange_RGB.png'
import AddButton from '../../../icons/Large-Plus_outline_orange_RGB.png'

function ReceiptEdit(props) {

    // Data 
    const [receiptTotal, setReceiptTotal] = useState(35.00);

    const [items, setItems] = useState(props.receiptData.items);

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
        const newItem = { name: 'Name', price: 0.0, amount: 0, totalPrice: 0.0, lockedAmount: false }
        setItems([...items, newItem]);
    }

    const deleteItem = (idToDelete) => {
        const newItemList = items.filter((item) => (item.id !== idToDelete));
        setItems(() => newItemList);
    }

    const handleItemChange = (id, field, value) => {
        const updateField = (id, field, value) => {
            setItems(
                () => items.map(
                    (item) => item.id === id ? { ...item, [field]: value } : item
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
        <div>
            <div className="header-box">
                <button className="header-button" onClick={() => { }}>
                    <img className="header-icon" src={BackButton} alt="Back Button" />
                </button>
                <h1 className="orange-header">Receipt</h1>
                <button className="header-button" onClick={() => { }}>
                    <img className="header-icon" src={SettingsButton} alt="Settings Button" />
                </button>
            </div>
            <div className="receipt-container">
                <div className={`receipt-image-container ${isImageExpanded ? 'expanded' : ''}`}>
                    <img src="https://discuss.poynt.net/uploads/default/original/2X/6/60c4199364474569561cba359d486e6c69ae8cba.jpeg" alt="Original Receipt" className="receipt-image" />
                    <div className="expand-box" onClick={handleImageClick} />
                </div>
                <div className="receipt-items-holder">
                    <div>
                        <h1 className="receipt-title">Total amount spent: </h1>
                        <h1 className="receipt-total-amount">25.50</h1>
                    </div>
                    <hr className="horizontal-line" />
                    <ul className="receipt-items">
                        {items && items.map((item, index) => (
                            <React.Fragment key={index}>
                                <li className={isValidItem(item) ? 'valid' : 'invalid'}>
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
                                        onValueChange={(value, name, _) => handleItemChange(item.id, name, Number(value).toFixed(2))}
                                    />
                                        <input
                                            type="number"
                                            step="1"
                                            value={item.amount}
                                            onChange={(e) => handleItemChange(item.id, 'amount', Math.max(0, (e.target.value)))}
                                        />
                                        <CurrencyInput
                                            name="totalPrice"
                                            prefix="€"
                                            placeholder="Total amount"
                                            defaultValue={item.totalPrice}
                                            decimalScale={2}
                                            onValueChange={(value, name, _) => handleItemChange(item.id, name, Number(value).toFixed(2))}
                                        // onValueChange={(_, name, _) => handleItemChange(item.id, name, Math.max(0, parseInt(e.target.value)))}
                                        />
                                        <button onClick={() => deleteItem(item.id)}>Delete</button>
                                    </div>

                                </li>
                                {index !== items.length - 1 && <hr className="horizontal-line" />}
                            </React.Fragment>
                        ))}
                        <button className="add-button" onClick={() => createNewItem()}>
                            <img className="add-icon" src={AddButton} alt="Add Button" />
                        </button>
                    </ul>
                </div>
                <div>
                    <span className="receipt-title">Total amount spent:</span>
                    <span className="receipt-total-amount">${calculateTotal().toFixed(2)}</span>
                </div>
                <button className="share-button">Confirm</button>
            </div>
        </div>
    );
}

export default ReceiptEdit;
