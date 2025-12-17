export const createIncidentPopupHTML = (props) => {
    return `
        <div style="font-family: system-ui; padding: 8px; min-width: 220px;">
            <h3 style="margin: 0 0 8px; font-size: 16px; color: #1f2937;">
                ${props.title}
            </h3>
            <p style="margin: 0 0 8px; color: #6b7280; font-size: 13px;">
                ${props.description}
            </p>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                <span style="background: ${props.color}; color: white; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600;">
                    ${props.level}
                </span>
                <span style="background: #e5e7eb; color: #374151; padding: 2px 8px; border-radius: 4px; font-size: 11px;">
                    ${props.type}
                </span>
                ${props.isHighPriority === true || props.isHighPriority === 'true'
                    ? '<span style="background: #fef3c7; color: #92400e; padding: 2px 8px; border-radius: 4px; font-size: 11px;">⚠️ High Priority</span>'
                    : ''}
            </div>
        </div>
    `;
};
