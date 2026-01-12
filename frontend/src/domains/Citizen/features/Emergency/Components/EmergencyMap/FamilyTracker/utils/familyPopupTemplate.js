export const createFamilyPopupHTML = (props) => {
    const imageHtml = props.imageUrl
        ? `<img src="${props.imageUrl}" alt="${props.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 50%; margin-bottom: 10px; border: 3px solid ${props.color};" onerror="this.style.display='none'" />`
        : `<div style="width: 80px; height: 80px; background: ${props.color}; border-radius: 50%; margin-bottom: 10px; display: flex; align-items: center; justify-content: center; font-size: 32px; color: white;">${props.name.charAt(0)}</div>`;

    return `
        <div style="font-family: system-ui; min-width: 200px; padding: 10px; text-align: center;">
            ${imageHtml}
            <h3 style="margin: 0 0 5px; color: ${props.color};">
                ${props.name}
            </h3>
            <div style="font-size: 12px; color: #888; margin-bottom: 10px;">
                ${props.description}
            </div>
            <div style="font-size: 12px; color: #666; margin-bottom: 8px;">
                 ${props.address}
            </div>
            <div style="background: rgba(0,0,0,0.1); padding: 8px; border-radius: 6px; font-size: 12px;">
                <div style="color: #888;">Contact</div>
                <div style="color: #333; font-weight: bold;"> ${props.contactPhone}</div>
            </div>
        </div>
    `;
};
