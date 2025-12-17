import { DEFAULT_ICON } from '../constants/pharmacyConfig';
import { ICONS } from './popupIcons';

export const createPharmacyPopupHTML = (props) => {
    return `
    <div style="
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      min-width: 260px;
      padding: 12px;
    ">

      <!-- HEADER -->
      <div style="
        display: flex;
        gap: 12px;
        align-items: center;
        margin-bottom: 12px;
      ">
        <img
          src="${props.imageUrl || DEFAULT_ICON}"
          onerror="this.src='${DEFAULT_ICON}'"
          style="
            width: 52px;
            height: 52px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid #22c55e;
            box-shadow: 0 0 0 3px rgba(34,197,94,0.18);
          "
        />

        <div>
          <h3 style="
            margin: 0;
            font-size: 15px;
            font-weight: 600;
            color: #22c55e;
            line-height: 1.2;
          ">
            ${props.storeName}
          </h3>

          <div style="
            margin-top: 2px;
            font-size: 11px;
            color: #9ca3af;
            display: flex;
            align-items: center;
            gap: 6px;
          ">
            ${ICONS.pharmacy}
            Pharmacy
          </div>
        </div>
      </div>

      <!-- ADDRESS -->
      <div style="
        font-size: 12px;
        color: #cbd5e1;
        display: flex;
        gap: 6px;
        align-items: flex-start;
        line-height: 1.4;
        margin-bottom: 12px;
      ">
        ${ICONS.mapPin}
        <span>${props.address}</span>
      </div>

      <!-- INFO GRID -->
      <div style="
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
        margin-bottom: 12px;
      ">

        <!-- LICENSE -->
        <div style="
          background: rgba(255,255,255,0.04);
          padding: 8px 6px;
          border-radius: 10px;
          text-align: center;
          border: 1px solid rgba(255,255,255,0.06);
        ">
          <div style="
            font-size: 11px;
            color: #9ca3af;
            margin-bottom: 2px;
          ">
            License
          </div>
          <div style="
            font-size: 12px;
            font-weight: 600;
            color: #22c55e;
          ">
            ${props.licenseStatus}
          </div>
        </div>

        <!-- RATING -->
        <div style="
          background: rgba(255,255,255,0.04);
          padding: 8px 6px;
          border-radius: 10px;
          text-align: center;
          border: 1px solid rgba(255,255,255,0.06);
        ">
          <div style="
            font-size: 11px;
            color: #9ca3af;
            margin-bottom: 2px;
          ">
            Rating
          </div>
          <div style="
            font-size: 12px;
            font-weight: 600;
            color: #fbbf24;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 4px;
          ">
            ${ICONS.star}
            ${props.rating}
          </div>
        </div>
      </div>

      <!-- DETAILS -->
      <div style="
        border-top: 1px solid rgba(255,255,255,0.08);
        padding-top: 8px;
        font-size: 12px;
        color: #d1d5db;
      ">
        <p style="margin: 6px 0;"><b>License #:</b> ${props.licenseNumber}</p>
        <p style="margin: 6px 0;"><b>Owner:</b> ${props.ownerName}</p>
        <p style="margin: 6px 0; display:flex; gap:6px; align-items:center;">
          ${ICONS.clock}
          <span><b>Hours:</b> ${props.openingHours}</span>
        </p>
        <p style="margin: 6px 0; display:flex; gap:6px; align-items:center;">
          ${ICONS.phone}
          <span><b>Phone:</b> ${props.contactPhone}</span>
        </p>

        <p style="
          margin: 8px 0 0;
          display: flex;
          align-items: center;
          gap: 6px;
        ">
          <b>Tax:</b>
          ${
        props.taxCompleted
            ? `${ICONS.check} <span style="color:#22c55e;font-weight:600">Completed</span>`
            : `${ICONS.x} <span style="color:#ef4444;font-weight:600">Not completed</span>`
    }
        </p>
      </div>

    </div>
  `;
};
