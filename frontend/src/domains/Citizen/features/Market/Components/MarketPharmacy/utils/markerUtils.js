import { DEFAULT_ICON, THEME } from '../constants/pharmacyConfig';

export const createMarkerElement = (store, isSelected = false) => {
    const container = document.createElement('div');
    container.className = 'landmark-marker';
    container.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
        cursor: pointer;
        transition: transform 0.2s;
    `;

    // Image container with circular border
    const imgContainer = document.createElement('div');
    imgContainer.style.cssText = `
        width: ${isSelected ? '56px' : '48px'};
        height: ${isSelected ? '56px' : '48px'};
        border-radius: 50%;
        border: 3px solid ${isSelected ? THEME.primary : '#ffffff'};
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        overflow: hidden;
        background: ${THEME.primaryBg};
        transition: all 0.2s;
    `;

    const img = document.createElement('img');
    img.src = store.imageUrl || DEFAULT_ICON;
    img.alt = store.storeName;
    img.style.cssText = `
        width: 100%;
        height: 100%;
        object-fit: cover;
    `;
    img.onerror = () => { img.src = DEFAULT_ICON; };

    imgContainer.appendChild(img);
    container.appendChild(imgContainer);

    // Store name label
    const label = document.createElement('div');
    label.textContent = store.storeName.length > 15
        ? store.storeName.substring(0, 15) + '...'
        : store.storeName;
    label.style.cssText = `
        margin-top: 4px;
        padding: 2px 6px;
        background: ${isSelected ? THEME.primary : 'rgba(255,255,255,0.95)'};
        color: ${isSelected ? '#ffffff' : '#1e293b'};
        font-size: 11px;
        font-weight: 600;
        border-radius: 4px;
        white-space: nowrap;
        box-shadow: 0 1px 4px rgba(0,0,0,0.2);
        font-family: system-ui, -apple-system, sans-serif;
    `;
    container.appendChild(label);

    // Hover effect
    container.onmouseenter = () => {
        imgContainer.style.transform = 'scale(1.1)';
    };
    container.onmouseleave = () => {
        imgContainer.style.transform = 'scale(1)';
    };

    return container;
};
