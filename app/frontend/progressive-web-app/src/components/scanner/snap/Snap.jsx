import Roboflow from "./Roboflow";
import "./Snap.css"
import PropTypes from 'prop-types';

function Snap(props) {

    const Snap = ({ parseReceiptImageOnServer, isLoading }) => {

    };

    Snap.propTypes = {
        parseReceiptImageOnServer: PropTypes.func.isRequired,
        isLoading: PropTypes.bool
    };

    Snap.defaultProps = {
        isLoading: false
    };

    return <>
        <div className="container">
            <div className="top-bar">
                <span style={{ color: "#e3e3e5" }}>Cancel</span>
                <span>Scanner</span>
                <span className="info-icon">&#9432;</span>
            </div>

            <div className={`camera-container ${props.isLoading ? 'blurred' : ''}`}>
                <Roboflow parseReceiptImageOnServerAction={props.parseReceiptImageOnServerAction} />
            </div>

            <div className="bottom-bar"></div>
        </div>
    </>
}

export default Snap;