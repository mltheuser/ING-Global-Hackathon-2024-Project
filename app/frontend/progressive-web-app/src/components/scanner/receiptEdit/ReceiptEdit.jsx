import React, { useState } from 'react';
import CurrencyInput from 'react-currency-input-field';
import './ReceiptEdit.css';
import axios from "axios";

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
        const newItem = { name: 'Name', amount: 1, totalPrice: 0.0 }
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
                    "total": total
                }
            }

            const requestJSON = dataToRequestJSON(items, receiptTotal)

            // todo: maybe move localhost:8000 to env file
            const imageResponse = await axios.post('http://localhost:8000/bill/generate-link', JSON.stringify(requestJSON), {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            )
            console.log("Backend responded with status " + imageResponse.status)
            const uuid = imageResponse.data.uuid
            console.log("Receipt saved under uuid " + uuid)
            setSharingLink(() => uuid)
        }
    }

    const [isImageExpanded, setIsImageExpanded] = useState(false);

    const handleImageClick = () => {
        setIsImageExpanded(!isImageExpanded);
    };

    const calculateItemTotal = (amount, price) => {
        return amount * price;
    };

    if (sharingLink == null) {
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
                                    onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                                />
                                <div><CurrencyInput
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
    } else {
        return <div>
            Share the following link: '{sharingLink}'
        </div>
    }
}

export default ReceiptEdit;
