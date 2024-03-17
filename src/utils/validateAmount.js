export const validateAmount = (value) => {
    let error;
    const amountRegex = /^(0|[1-9]\d*)$/;
    if(!amountRegex.test(value)) {
        error = "Введите число";
    }
    return error;
};