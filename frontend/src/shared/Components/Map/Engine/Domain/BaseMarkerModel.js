/**
 * ✅ BaseMarkerModel
 * - Chuẩn hoá dữ liệu marker trước khi render
 */
export class BaseMarkerModel {
    constructor({ id, coords, element, onClick }) {
        this.id = id;
        this.coords = coords; // [lng, lat]
        this.element = element; // JSX element
        this.onClick = onClick;


        Object.freeze(this);
    }
}