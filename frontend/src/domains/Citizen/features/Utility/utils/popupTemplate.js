export const getWifiStatusColor = (status) => {
    switch (status) {
        case 'EXCELLENT': return '#00e400';
        case 'GOOD': return '#7cfc00';
        case 'FAIR': return '#ffff00';
        case 'POOR': return '#ff7e00';
        case 'BAD': return '#ff0000';
        default: return '#888';
    }
};

export const createUtilityPopupHTML = (props) => {
    return `
        <div style="font-family: system-ui; min-width: 200px; padding: 5px;">
            <h3 style="margin: 0 0 10px; color: #333; border-bottom: 2px solid #11b4da; padding-bottom: 5px;">
                ${props.stationName}
            </h3>
            <div style="font-size: 12px; color: #666; margin-bottom: 10px;">
                ${props.address}
            </div>
            
            <div style="display: grid; gap: 8px;">
                <div style="background: linear-gradient(135deg, #00b4d8, #0077b6); 
                    padding: 8px; border-radius: 6px; color: white;">
                    <b>Water:</b> ${props.waterUsage || 'N/A'} m³
                </div>
                
                <div style="background: linear-gradient(135deg, #ff9500, #ff6b00); 
                    padding: 8px; border-radius: 6px; color: white;">
                    <b>Electricity:</b> ${props.electricityUsage || 'N/A'} kWh
                </div>
                
                <div style="background: ${getWifiStatusColor(props.wifiStatus)}; 
                    padding: 8px; border-radius: 6px; color: ${props.wifiStatus === 'FAIR' ? '#333' : 'white'};">
                    <b>Wifi Ping:</b> ${props.wifiPing || 'N/A'} ms 
                    <span style="font-size: 11px;">(${props.wifiStatus || 'N/A'})</span>
                </div>
            </div>
        </div>
    `;
};
