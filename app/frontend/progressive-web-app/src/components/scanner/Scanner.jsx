import { useState } from "react";
import axios from "axios";
import Snap from "./snap/Snap"
import Spinner from "../spinner/Spinner";
import ReceiptEdit from "./receiptEdit/ReceiptEdit";

function Scanner() {

    const [isLoading, setIsLoading] = useState(false)
    const [receiptData, setReceiptData] = useState(null)

    async function parseReceiptImageOnServer(imageBlob) {
        setIsLoading(true)
        try {
            // Send the image blob to your server
            const imageResponse = await axios.post('http://127.0.0.1:5000/scan', imageBlob, {
                headers: {
                    'Content-Type': 'application/octet-stream',
                },
            });

            console.log('Server response:', imageResponse.data);

            console.log(imageResponse)

            setReceiptData({ imageBlob: imageBlob, items: imageResponse.data.items })
        } catch (error) {
            console.error('Error:', error.message);
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return (
            <>
                <Spinner />
                <Snap parseReceiptImageOnServerAction={parseReceiptImageOnServer} />
            </>
        )
    }
    if (receiptData) {
        return <>
            <ReceiptEdit receiptData={receiptData} />
        </>
    }
    return (
        <Snap parseReceiptImageOnServerAction={parseReceiptImageOnServer} />
    )

}

export default Scanner;