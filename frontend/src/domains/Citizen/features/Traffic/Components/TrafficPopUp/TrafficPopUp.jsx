/* Lo UI , kết hợp với MapPopUp*/
import Button from "../../../../../../shared/Components/UI/Button/Button.jsx";
import './TrafficPopUp.css';

const TrafficPopUp = ({data}) => {
    if (!data) return null;
    return (
        <div className="traffic-popup">
            <div className="popup-image">
                <img src={data.image} alt={data.title} />
            </div>

            <div className="popup-content">
                <h2>{data.title}</h2>
                <p className={`level ${data.level.toLowerCase()}`}>
                    Level: {data.level}
                </p>
                <p className="description">{data.description}</p>
            </div>

            <div className="popup-actions">
                <Button variant="secondary">Detail</Button>
                <Button variant="primary">Report</Button>
            </div>
        </div>
    );
};

export default TrafficPopUp;