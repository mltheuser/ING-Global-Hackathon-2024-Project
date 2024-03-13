import Roboflow from "./Roboflow";
import "./Snap.css"

function Snap(props) {

    return <>
        <div className="container">
            <div className="top-bar">
                <span style={{ color: "#e3e3e5" }}>Cancel</span>
                <span>Scanner</span>
                <span className="info-icon">&#9432;</span>
            </div>

            <div className="camera-container">
                <Roboflow parseReceiptImageOnServerAction={props.parseReceiptImageOnServerAction} />
            </div>

            <div className="bottom-bar"></div>
        </div>
    </>
}

export default Snap;