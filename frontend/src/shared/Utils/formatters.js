// chuẩn hóa tiền tệ
export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
};


//chuẩn hóa ngày
export const formatDate = (date) => {
    return new Date(date).toLocaleDateString('vi-VN');
};

//chuẩn hóa ngày -giờ
export const formatDateTime = (date, locale = 'vi-VN', options = {}) => {
    return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: options.hour ? '2-digit' : undefined,
        minute: options.minute ? '2-digit' : undefined,
        second: options.second ? '2-digit' : undefined,
        hour12: false,
    }).format(new Date(date));
};


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

