/**
 * Adapter to convert Method2 API response to BranchIncident format
 * Method2 API returns optimization data, we adapt it to your branch format
 */

export class BranchMethod2Adapter {
    /**
     * Convert Method2 API response to BranchIncident format
     * @param {Object} branch - Branch from Method2 API
     * @returns {Object} - Format compatible with BranchIncident
     */
    static adaptBranch(branch) {
        // Method2 returns: id, code, name, latitude, longitude, city, address, ...
        // Your format expects: id, branchName, coords, branchType, performanceLevel, ...

        return {
            // Basic info (from Method2)
            id: branch.id,
            code: branch.code,
            branchName: branch.name,
            address: branch.address,
            city: branch.city || "",

            latitude: parseFloat(branch.latitude) || 0,
            longitude: parseFloat(branch.longitude) || 0,
            coords: [
                parseFloat(branch.longitude) || 0,
                parseFloat(branch.latitude) || 0
            ],

            // Stock info (from Method2)
            currentStock: branch.currentStock || 0,
            demand: branch.demand || 0,
            leadTime: branch.leadTime || 0,
            distance: branch.distance || 0,

            manager: branch.manager || "Chưa cập nhật",
            employeeCount: parseInt(branch.employeeCount) || 0,
            monthlyRevenue: parseFloat(branch.monthlyRevenue) || 0,
            monthlyExpense: parseFloat(branch.monthlyExpense) || 0,
            monthlyProfit: parseFloat(branch.monthlyProfit) || 0,

            // Default values (you can update these from UI later)
            branchType: this.inferBranchType(branch.name),
            performanceLevel: this.calculatePerformanceLevel(branch),

            // Optimization data (NEW from Method2)
            optimization: branch.optimization ? {
                status: branch.optimization.status,
                strategy: branch.optimization.strategy,
                optimalQ: branch.optimization.optimalQ,
                reorderPoint: branch.optimization.reorderPoint,
                safetyStock: branch.optimization.safetyStock,
                costSavings: branch.optimization.costSavings,
                optimalShipments: branch.optimization.optimalShipments,
            } : null,

            // Placeholder values (keep for now)
            image: null,

            inventoryCount: parseFloat(branch.currentStock) || 0,
        };
    }

    /**
     * Infer branch type from name
     * You can enhance this logic based on name patterns
     */
    static inferBranchType(name) {
        const lowerName = (name || "").toLowerCase();

        if (lowerName.includes("warehouse") || lowerName.includes("kho"))
            return "WAREHOUSE";
        if (lowerName.includes("factory") || lowerName.includes("xưởng"))
            return "FACTORY";
        if (lowerName.includes("office") || lowerName.includes("văn phòng"))
            return "OFFICE";

        return "RETAIL";  // Default
    }

    /**
     * Calculate performance level based on stock status
     */
    static calculatePerformanceLevel(branch) {
        if (!branch.currentStock || !branch.demand) return "AVERAGE";

        const ratio = branch.currentStock / branch.demand;

        if (ratio >= 3) return "EXCELLENT";
        if (ratio >= 2) return "GOOD";
        if (ratio >= 1) return "AVERAGE";
        return "POOR";
    }


    /**
     * Calculate performance level based on stock status
     */
    static calculatePerformanceLevel(branch) {
        const stock = parseFloat(branch.currentStock) || 0;
        const demand = parseFloat(branch.demand) || 0;

        if (demand === 0) return "AVERAGE";

        const ratio = stock / demand;

        if (ratio >= 3) return "EXCELLENT";
        if (ratio >= 2) return "GOOD";
        if (ratio >= 1) return "AVERAGE";
        return "POOR";
    }


    /**
     * Adapt multiple branches
     */
    static adaptBranches(branches) {
        if (!Array.isArray(branches)) return [];
        return branches.map(b => this.adaptBranch(b));
    }
}