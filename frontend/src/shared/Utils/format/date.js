
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
