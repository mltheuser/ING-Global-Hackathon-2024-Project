import React, { useEffect, useState } from "react";
import './Settle.css';
import axios from "axios";
import CurrencyInput from 'react-currency-input-field';


async function put_request(path, json_data) {
    var data = new FormData()
    data.append("json", JSON.stringify(json_data))

    const response = await axios.put(path, JSON.stringify(json_data), {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    )
    console.log(response);
    
}

async function get_request(path) {
    const response = await axios.get("http://localhost:8000/bill/d4772018-334f-40a6-86e7-c5fad3db00b9/get");
    return response;
}

function Settle() {

    const [isImageExpanded, setIsImageExpanded] = useState(false);
    const [bill, setBill] = useState("");
    const [userPays, setUserPays] = useState([]);

    const addNewUserItem = (id, quantity, price, unit_price) => { 
        const newUserItem = { id: id, quantity_paid: quantity, price_paid: price, unit_price: unit_price }
        setUserPays([...userPays, newUserItem]);
    }

    const calculateTotal = () => {
        return userPays.reduce((total, item) =>  (item.quantity_paid !== 0) ? total + item.quantity_paid * item.unit_price : total + item.price_paid, 0);
    };
                        
    const handleImageClick = () => {
        setIsImageExpanded(!isImageExpanded);
    };

    useEffect(() => {
        get_request().then(res => {setBill(JSON.parse(JSON.stringify(res.data.bill)));});
    },[]);
    

    return (
        <div className="receipt-container">
        <h1>Digital Receipt</h1>
        <div className={`receipt-image-container ${isImageExpanded ? 'expanded' : ''}`} onClick={handleImageClick}>
            <img src="https://discuss.poynt.net/uploads/default/original/2X/6/60c4199364474569561cba359d486e6c69ae8cba.jpeg" alt="Original Receipt" className="original-receipt" />
            <div className="expand-icon">&#x2922;</div>
        </div>
        <ul className="receipt-items">
                <li className="receipt-items-bold">
                    <div>Name</div>
                    <div>Quantity</div>
                    <div>Unit price</div>
                    <div>Total price</div>
                    <div></div>
                </li>
            {bill != "" && bill.items.map((item, index) => (
            <React.Fragment key={index}>
                <li>
                    <div>{item.name}</div>
                    <div>{Math.max(item.quantity - item.quantity_paid,0)}</div>
                    <div>{item.unit_price}</div>
                    <div>{item.total_price}</div>
                    {(item.quantity - item.quantity_paid > 0) && <button onClick={() => {addNewUserItem(item.id,1,0, item.unit_price)}}>Pay</button>}
                </li>
            {index !== bill.items.length - 1 && <hr className="item-separator" />}
            </React.Fragment>            
        ))}
        </ul>
        <div className="receipt-total">
            <span className="total-label">Total to pay:</span>
            <span className="total-amount">${calculateTotal().toFixed(2)}</span>
        </div>
        <button className="checkout-button" onClick={() => {put_request("http://localhost:8000/bill/d4772018-334f-40a6-86e7-c5fad3db00b9/settle", {"changes": userPays})
                                                            get_request().then(res => {setBill(JSON.parse(JSON.stringify(res.data.bill)));});}}>Settle</button>
    </div>
    );
}

export default Settle;