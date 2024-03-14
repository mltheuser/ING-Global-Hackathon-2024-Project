import React, { useState } from 'react';
import { FiMoreVertical } from 'react-icons/fi';
import CurrencyInput from 'react-currency-input-field';
import './ReceiptItem.css';

const ReceiptItem = ({ item, options, onStateChange }) => {

    const { name, amount, totalPrice } = item;
    const { forceIsCustomContribution } = options;

    const pricePerItem = (totalPrice / amount).toFixed(2)

    const [current, setCurrent] = useState(forceIsCustomContribution ? amount : 0);
    const [isCustomContribution, setisCustomContribution] = useState(forceIsCustomContribution ? true : false);
    const [currentContribution, setCurrentContribution] = useState(forceIsCustomContribution ? totalPrice : 0);

    const handleIncrement = () => {
        if (current < amount) {
            setCurrent(current + 1)
            setCurrentContribution((current + 1) * pricePerItem)
            onStateChange({ current: current + 1, currentContribution: (current + 1) * pricePerItem });
        }
    };
    const handleDecrement = () => {
        if (current > 0) {
            setCurrent(current - 1);
            setCurrentContribution((current - 1) * pricePerItem)
            onStateChange({ current: current - 1, currentContribution: (current - 1) * pricePerItem });
        }
    };

    const handleMenuToggle = () => {
        if (forceIsCustomContribution) {
            return
        }
        setCurrent(amount)
        setCurrentContribution(totalPrice)
        setisCustomContribution(!isCustomContribution);
        onStateChange({ current: amount, currentContribution: totalPrice });
    };

    return (
        <div className="receipt-item">
            <div className="receipt-item-first-row">
                <h3 className="item-name">{name}</h3>
                <p className="item-price">€{(totalPrice / amount).toFixed(2)}</p>
                <div className="item-quantity">
                    {!isCustomContribution && (
                        <button className="quantity-btn" onClick={handleDecrement}>
                            -
                        </button>
                    )}
                    <span className="quantity-display">
                        {current}/{amount}
                    </span>
                    {!isCustomContribution && (
                        <button className="quantity-btn" onClick={handleIncrement}>
                            +
                        </button>
                    )}
                </div>
                <span className="quantity-display">
                    {Number(currentContribution).toFixed(2)}
                </span>
                {!forceIsCustomContribution && (
                    <div className="item-menu">
                        <button className="menu-btn" onClick={handleMenuToggle}>
                            <FiMoreVertical />
                        </button>
                    </div>
                )}
            </div>
            {isCustomContribution && (
                <div className="receipt-item-second-row">
                    <p className="current-progress">€{`${Number(currentContribution).toFixed(2)}/${totalPrice}`}</p>
                    <div className="custom-contribution">
                        <CurrencyInput
                            name="contribution"
                            prefix="€"
                            defaultValue={totalPrice}
                            fixedDecimalLength={2}
                            maxLength={8}
                            onValueChange={(value, name, _) => {
                                setCurrentContribution(value)
                                onStateChange({ current: current, currentContribution: Number(value) });
                            }}
                        />
                        <span className="info-icon">&#9432;</span>
                    </div>
                </div>
            )
            }
        </div >
    );
};

export default ReceiptItem;