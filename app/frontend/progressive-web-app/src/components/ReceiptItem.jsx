import React, { useState } from 'react';
import { FiMoreHorizontal } from 'react-icons/fi';
import './ReceiptItem.css';

const ReceiptItem = ({ name, price, total }) => {
    const [current, setCurrent] = useState(0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [customContribution, setCustomContribution] = useState('');

    const handleIncrement = () => {
        if (current < total) {
            setCurrent(current + 1);
        }
    };

    const handleDecrement = () => {
        if (current > 0) {
            setCurrent(current - 1);
        }
    };

    const handleMenuToggle = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleCustomContribution = () => {
        const contribution = parseFloat(customContribution);
        if (!isNaN(contribution) && contribution >= 0) {
            setCurrent(Math.min(contribution, total));
        }
        setCustomContribution('');
        setIsMenuOpen(false);
    };

    return (
        <div className="receipt-item">
            <div className='receipt-item.first-row'>
                <div className="item-info">
                    <h3 className="item-name">{name}</h3>
                    <p className="item-price">${price.toFixed(2)}</p>
                </div>
                <div className="item-quantity">
                    <button className="quantity-btn" onClick={handleDecrement}>
                        -
                    </button>
                    <span className="quantity-display">
                        {current}/{total}
                    </span>
                    <button className="quantity-btn" onClick={handleIncrement}>
                        +
                    </button>
                </div>
                <div className="item-menu">
                    <button className="menu-btn" onClick={handleMenuToggle}>
                        <FiMoreHorizontal />
                    </button>
                </div>
            </div>
            {isMenuOpen && (
                <div className="receipt-item.second-row">
                    <div className="menu-item" onClick={handleMenuToggle}>
                        Custom Contribution
                    </div>
                    {isMenuOpen && (
                        <div className="custom-contribution">
                            <input
                                type="number"
                                value={customContribution}
                                onChange={(e) => setCustomContribution(e.target.value)}
                                placeholder="Enter amount"
                            />
                            <button onClick={handleCustomContribution}>Apply</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ReceiptItem;