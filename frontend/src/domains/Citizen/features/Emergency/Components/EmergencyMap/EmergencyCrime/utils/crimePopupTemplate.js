import { priorityColors } from '../constants/crimeConfig';

export const createCrimePopupHTML = (props) => {
    const imageHtml = props.imageUrl
        ? `<img src="${props.imageUrl}" alt="Suspect" style="width: 100%; max-height: 120px; object-fit: cover; border-radius: 4px; margin-bottom: 8px;" onerror="this.style.display='none'" />`
        : `<div style="width: 100%; height: 80px; background: #333; border-radius: 4px; margin-bottom: 8px; display: flex; align-items: center; justify-content: center; color: #666;">No Image</div>`;

    return `
        <div style="font-family: system-ui; min-width: 220px; padding: 5px;">
            <h3 style="margin: 0 0 10px; color: #ff0000; border-bottom: 2px solid #ff0000; padding-bottom: 5px;">
                🚨 ${props.name}
            </h3>
            ${imageHtml}
            <div style="font-size: 12px; color: #666; margin-bottom: 8px;">
                📍 ${props.address}
            </div>
            <div style="background: ${priorityColors[props.priority]}; color: white; padding: 6px; border-radius: 4px; text-align: center; margin-bottom: 8px; font-weight: bold;">
                ${props.priority} PRIORITY
            </div>
            <div style="font-size: 13px;">
                <p style="margin: 4px 0;"><b>Status:</b> ${props.status}</p>
                <p style="margin: 4px 0;"><b>Description:</b> ${props.description}</p>
                <p style="margin: 4px 0;"><b>Report to:</b> ${props.contactPhone}</p>
            </div>
        </div>
    `;
};
