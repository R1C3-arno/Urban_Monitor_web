export const mapToBranches = (rawData) => {
    console.log("📊 Raw API data:", rawData);
    if (!Array.isArray(rawData)) return [];

    return rawData.map(branch => {
        const branchName = branch.branchName || branch.name || "Unknown";

        // ✅ Khai báo let thay vì const
        let lat = 0;
        let lng = 0;

        // ✅ Lấy từ latitude/longitude (từ API)
        if (branch.latitude !== undefined && branch.latitude !== null) {
            lat = parseFloat(branch.latitude) || 0;
        }

        if (branch.longitude !== undefined && branch.longitude !== null) {
            lng = parseFloat(branch.longitude) || 0;
        }
        if (branch.coords && Array.isArray(branch.coords) && branch.coords.length === 2) {
            [lng, lat] = branch.coords;
        }

        const mapped = {
            id: branch.id,
            code: branch.code,
            name: branchName,
            branchName: branchName,
            latitude: lat,
            longitude: lng,
            branchType: branch.branchType || inferBranchType(branchName),
            performanceLevel: calculatePerformance(branch),
            currentStock: parseFloat(branch.currentStock) || 0,
            demand: parseFloat(branch.demand) || 0,
            leadTime: parseFloat(branch.leadTime) || 0,
            distance: parseFloat(branch.distance) || 0,
            city: branch.city || "",
            address: branch.address || "",

            // ✅ ADD THESE DEFAULT VALUES
            manager: branch.manager ?? "Chưa cập nhật",
            employeeCount: Number(branch.employeeCount ?? 0),
            monthlyRevenue: Number(branch.monthlyRevenue ?? 0),
            monthlyExpense: Number(branch.monthlyExpense ?? 0),
            monthlyProfit: Number(branch.monthlyProfit ?? 0),
            inventoryCount: parseFloat(branch.currentStock) || 0,
            image: branch.image || null,
            optimization: branch.optimization || null,
        };

        console.log("✅ Mapped branch:", mapped);
        return mapped;
    });
};

export const mapToZones = (branches) => {
    return branches
        .filter(b => b.latitude && b.longitude)
        .map(branch => ({
            id: branch.id,
            name: branch.name,
            center: [branch.longitude, branch.latitude],
            radius: branch.distance || 5,
        }));
};

const calculatePerformance = (branch) => {
    const stock = parseFloat(branch.currentStock) || 0;
    const demand = parseFloat(branch.demand) || 0;

    if (demand === 0) return "AVERAGE";

    const ratio = stock / demand;
    if (ratio >= 3) return "EXCELLENT";
    if (ratio >= 2) return "GOOD";
    if (ratio >= 1) return "AVERAGE";
    return "POOR";
};

const inferBranchType = (name) => {
    if (!name) return "RETAIL";
    const lower = name.toLowerCase();
    if (lower.includes("warehouse") || lower.includes("kho")) return "WAREHOUSE";
    if (lower.includes("factory") || lower.includes("xưởng")) return "FACTORY";
    if (lower.includes("office") || lower.includes("văn phòng")) return "OFFICE";
    return "RETAIL";
};