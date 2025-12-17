export const createAirQualityPopupHTML = (props) => {
    // Nếu là vùng không có dữ liệu (hasData = false)
    if (!props.hasData) {
        return `<div style="font-family:system-ui; padding:5px;"><h3>${props.zoneName}</h3><i>Chưa có dữ liệu</i></div>`;
    }

    return `
        <div style="font-family:system-ui; min-width:180px;">
            <h3 style="margin:0 0 5px;">${props.zoneName}</h3>
            <div style="background:${props.color}; color:#000; padding:4px; border-radius:4px; text-align:center; font-weight:bold; margin-bottom:6px;">
                AQI: ${props.aqi}
            </div>
            <div style="font-size:12px;">
                PM2.5: ${props.pm25}<br/>
                PM10: ${props.pm10}<br/>
                Temp: ${props.temperature}°C<br/>
                Humidity: ${props.humidity}%
            </div>
        </div>
    `;
};
