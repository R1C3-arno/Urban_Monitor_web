export class BranchIncident {
    constructor({
        id, branchName, branchType, performanceLevel, lat, lng, image,
        manager, employeeCount, monthlyRevenue, monthlyExpense, monthlyProfit,
        inventoryValue, inventoryCount, address
    }) {
        this._id = id;
        this._branchName = branchName;
        this._branchType = branchType;
        this._performanceLevel = performanceLevel;
        this._lat = lat;
        this._lng = lng;
        this._image = image;
        this._manager = manager;
        this._employeeCount = employeeCount;
        this._monthlyRevenue = monthlyRevenue;
        this._monthlyExpense = monthlyExpense;
        this._monthlyProfit = monthlyProfit;
        this._inventoryValue = inventoryValue;
        this._inventoryCount = inventoryCount;
        this._address = address;
        Object.freeze(this);
    }

    get id() { return this._id; }
    get branchName() { return this._branchName; }
    get branchType() { return this._branchType; }
    get performanceLevel() { return this._performanceLevel; }
    get lat() { return this._lat; }
    get lng() { return this._lng; }
    get coords() { return [this._lng, this._lat]; }
    get image() { return this._image; }
    get manager() { return this._manager; }
    get employeeCount() { return this._employeeCount; }
    get monthlyRevenue() { return this._monthlyRevenue; }
    get monthlyExpense() { return this._monthlyExpense; }
    get monthlyProfit() { return this._monthlyProfit; }
    get inventoryValue() { return this._inventoryValue; }
    get inventoryCount() { return this._inventoryCount; }
    get address() { return this._address; }

    toJSON() {
        return {
            id: this._id,
            branchName: this._branchName,
            branchType: this._branchType,
            performanceLevel: this._performanceLevel,
            lat: this._lat,
            lng: this._lng,
            image: this._image,
            manager: this._manager,
            employeeCount: this._employeeCount,
            monthlyRevenue: this._monthlyRevenue,
            monthlyExpense: this._monthlyExpense,
            monthlyProfit: this._monthlyProfit,
            inventoryValue: this._inventoryValue,
            inventoryCount: this._inventoryCount,
            address: this._address,
        };
    }

    static fromAPI(data) {
        return new BranchIncident(data);
    }
}
