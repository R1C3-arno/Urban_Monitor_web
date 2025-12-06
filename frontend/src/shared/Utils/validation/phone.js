//check số phone
export const isValidPhone = (phone) => {
    const regex = /^(0|\+84)(3|5|7|8|9)\d{8}$/;
    return regex.test(phone.replace(/\s/g, ''));
};
