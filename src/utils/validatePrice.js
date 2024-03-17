export const validatePrice = (value) => {
    let error;
    const priceRegex = /^\d+(,\d{2})?$/;
    if(!priceRegex.test(value)) {
        error = "Неверный формат";
    }
    return error;
};