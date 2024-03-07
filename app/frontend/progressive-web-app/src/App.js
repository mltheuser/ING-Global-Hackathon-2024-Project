import meme from './meme.webp';
import './App.css';
import axios from 'axios';
import { useState } from 'react';

function App() {
  const [receiptItems, setReceiptItems] = useState([]);

  const scanImage = async () => {
    try {
      // Fetch image
      const response = await fetch(meme);

      // Check if image fetching was successful
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Get image as blob
      const blob = await response.blob();

      // Send the image to your server
      const imageResponse = await axios.post('http://127.0.0.1:5000/scan', blob, {
        headers: {
          'Content-Type': 'application/octet-stream',
        },
      });

      console.log('Server response:', imageResponse.data);

      // Update the state with the receipt items
      setReceiptItems(imageResponse.data.receipt);
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={meme} className="App-logo" alt="logo" />
        <button onClick={scanImage} style={{margin: "50px"}}>Get Help</button>
        <ul>
          {receiptItems.map((item, index) => (
            <li key={index}>
              {item.name} - Amount: {item.amount}, Price: {item.price}
            </li>
          ))}
        </ul>
      </header>
    </div>
  );
}

export default App;