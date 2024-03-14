import React, { useState } from 'react';
import CurrencyInput from 'react-currency-input-field';
import './ReceiptEdit.css';
import axios from "axios";
import ShareLink from './ShareLink'
import BackButton from '../../../icons/Chevron_left_outline_orange_RGB.png'
import SettingsButton from '../../../icons/Large-Setting_outline_orange_RGB.png'
import AddButton from '../../../icons/Large-Plus_outline_orange_RGB.png'
import { useNavigate } from "react-router-dom";

function ReceiptEdit(props) {

    // Data 
    const [receiptTotal, setReceiptTotal] = useState(35.00);

    const [items, setItems] = useState(props.receiptData.items);

    // Utils
    const calculateTotal = () => {
        return items.reduce((total, item) => total + Number(item.totalPrice), 0);
    };
    // Validity check input data
    const isValidItem = (item) => {
        return true;
    }

    const isValidTotal = () => {
        const calculatedTotal = calculateTotal();
        return calculatedTotal.toFixed(2) == receiptTotal.toFixed(2);
    }

    // Item
    const createNewItem = () => {
        const newItem = { name: 'Item Name', amount: 1, totalPrice: 0.0 }
        setItems([...items, newItem]);
    }

    const deleteItem = (indexToDelete) => {
        console.log(indexToDelete)
        const newItems = [...items.slice(0, indexToDelete), ...items.slice(indexToDelete + 1)];
        setItems(newItems);
    }

    const handleItemChange = (index, field, value) => {
        const updateField = (index, field, value) => {
            setItems(prevItems => {
                const updatedItems = [...prevItems];
                updatedItems[index] = {
                    ...updatedItems[index],
                    [field]: value
                };
                return updatedItems;
            });
        };

        if (field == 'price' || field == 'totalPrice' || field == 'amount' || field == 'name') {
            updateField(index, field, value)
        } else {
            console.error("Bad field");
        }
    }

    // TODO: don't hardcode backend address
    const [checkedOut, setCheckedOut] = useState(false)
    const [sharingLink, setSharingLink] = useState(null)
    async function checkout() {
        if (!(checkedOut)) {
            setCheckedOut(() => true)

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
                    "total": calculateTotal()
                }
            }

            const requestJSON = dataToRequestJSON(items, receiptTotal)

            // todo: maybe move localhost:8000 to env file
            const persistActionResponse = await axios.post('http://localhost:8000/bill/generate-link', JSON.stringify(requestJSON), {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            )
            console.log("Backend responded with status " + persistActionResponse.status)
            const uuid = persistActionResponse.data.uuid
            console.log("Receipt saved under uuid " + uuid)
            setSharingLink(() => uuid)
        }
    }

    const [isImageExpanded, setIsImageExpanded] = useState(false);

    const handleImageClick = () => {
        setIsImageExpanded(!isImageExpanded);
    };

    const navigate = useNavigate();

    const navigateToContribute = (path) => {
        navigate(path);
    }

    const calculateItemTotal = (amount, price) => {
        return amount * price;
    };

    if (sharingLink == null) {
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
                    <div onClick={handleImageClick} className={`receipt-image-container ${isImageExpanded ? 'expanded' : ''}`}>
                        <img src={props.receiptData.imageSrc} alt="Original Receipt" className="receipt-image" />
                        <div className="expand-box" />
                    </div>
                    <div className="receipt-items-holder">
                        <hr className="horizontal-line" />
                        <ul className="receipt-items">
                            {items && items.map((item, index) => (
                                <React.Fragment key={index}>
                                    <li className={isValidItem(item) ? 'valid' : 'invalid'}>
                                        <input
                                            type="text"
                                            value={item.name}
                                            onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                                        />
                                        <div className='receipt-fields'><CurrencyInput
                                            name="price"
                                            prefix="€"
                                            placeholder="Price per item"
                                            value={(item.totalPrice / item.amount).toFixed(2)}
                                            decimalScale={2}
                                            maxLength={8}
                                            onValueChange={(value, name, _) => handleItemChange(index, "totalPrice", Number(value * item.amount).toFixed(2))}
                                        />
                                            X
                                            <input
                                                value={item.amount}
                                                onChange={(e) => handleItemChange(index, 'amount', e.target.value)}
                                            />
                                            =
                                            <CurrencyInput
                                                name="totalPrice"
                                                prefix="€"
                                                placeholder="Total amount"
                                                value={item.totalPrice}
                                                decimalScale={2}
                                                onValueChange={(value, name, _) => handleItemChange(index, name, Number(value).toFixed(2))}
                                            // onValueChange={(_, name, _) => handleItemChange(item.id, name, Math.max(0, parseInt(e.target.value)))}
                                            />
                                            <button onClick={() => deleteItem(index)}>Delete</button>
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
                    <div className='receipt-footer'>
                        <span className="receipt-title">Total amount spent:</span>
                        <span className="receipt-total-amount">€{calculateTotal().toFixed(2)}</span>
                        <button className="share-button" onClick={() => checkout()} >Share</button>
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            // todo: shared css here with ReceiptEdit
            <div className="receipt-container share-link">
                <h1>You are almost there!</h1>
                <ShareLink sharingLink={sharingLink} />
                <p/>
                <button className="share-button" onClick={() => navigateToContribute("/contribute/" + sharingLink)} >Go to receipt dashboard</button>
            </div>
        )
    }
}

export default ReceiptEdit;
