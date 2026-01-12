import { severityColors, statusColors } from '../Constants/disasterConfig.jsx';

export const createPopupHTML = (props, config) => {
    return `
        <div style="font-family: system-ui; padding: 8px;">
            <h3 style="margin: 0 0 10px; color: ${config.color}; border-bottom: 2px solid ${config.color}; padding-bottom: 5px;">
                ${config.icon} ${props.name || props.provinceName}
            </h3>
            <div style="font-size: 12px; color: #666; margin-bottom: 8px;">
                 ${props.region}
            </div>
            <div style="display: inline-block; background: ${config.color}; color: white; padding: 4px 10px; border-radius: 12px; font-size: 11px; margin-bottom: 10px;">
                ${config.label}
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 10px;">
                <div style="background: ${severityColors[props.severity]}; color: white; padding: 6px; border-radius: 4px; text-align: center; font-size: 12px;">
                    ${props.severity}
                </div>
                <div style="background: ${statusColors[props.status]}; color: ${props.status === 'WARNING' ? '#333' : 'white'}; padding: 6px; border-radius: 4px; text-align: center; font-size: 12px;">
                    ${props.status}
                </div>
            </div>
            <div style="font-size: 12px;">
                <p style="margin: 4px 0;"><b>Measurement:</b> ${props.measurementValue} ${props.measurementUnit}</p>
                <p style="margin: 4px 0;"><b>Affected Area:</b> ${props.affectedAreaKm2?.toLocaleString()} km²</p>
                <p style="margin: 4px 0;"><b>Population:</b> ${props.affectedPopulation?.toLocaleString()}</p>
                <p style="margin: 4px 0;"><b>Description:</b> ${props.description}</p>
            </div>
            ${props.alertMessage ? `
            <div style="background: #fff3cd; padding: 8px; border-radius: 4px; margin-top: 10px; font-size: 12px; border-left: 4px solid #ffc107;">
                <strong></strong> ${props.alertMessage}
            </div>` : ''}
            ${props.contactHotline ? `
            <div style="margin-top: 10px; text-align: center;">
                <a href="tel:${props.contactHotline}" style="display: inline-block; background: #dc3545; color: white; padding: 6px 12px; border-radius: 4px; text-decoration: none; font-size: 12px;">
                     ${props.contactHotline}
                </a>
            </div>` : ''}
        </div>
    `;
};
