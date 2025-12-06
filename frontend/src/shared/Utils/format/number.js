//Chuẩn hóa số
export const formatNumber = (num) => {
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return num.toString();
};


//chuẩn hóa phần trăm

export const formatPercent = (value, decimals = 1) => {
    if (typeof value !== 'number') return '';
    return (value * 100).toFixed(decimals) + '%';
};

