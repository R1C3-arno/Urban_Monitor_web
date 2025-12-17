import { priorityColors } from '../constants/ambulanceConfig';

export const createAmbulancePopupHTML = (props) => {
    return `
        <div style="font-family: system-ui; min-width: 220px; padding: 5px;">
            <h3 style="margin: 0 0 10px; color: #ff0000; border-bottom: 2px solid #ff0000; padding-bottom: 5px;">
                🚑 ${props.name}
            </h3>
            <div style="font-size: 12px; color: #666; margin-bottom: 10px;">
                📍 ${props.address}
            </div>
            <div style="background: ${priorityColors[props.priority]}; color: white; padding: 6px; border-radius: 4px; text-align: center; margin-bottom: 8px;">
                Priority: ${props.priority}
            </div>
            <div style="font-size: 13px;">
                <p style="margin: 4px 0;"><b>Status:</b> ${props.status}</p>
                <p style="margin: 4px 0;"><b>Description:</b> ${props.description}</p>
                <p style="margin: 4px 0;"><b>Contact:</b> ${props.contactPhone}</p>
            </div>
        </div>
    `;
};
