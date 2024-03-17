export const validateName = (value) => {
    let error;
    if (!value) {
      error = "Поле не должно быть пустым";
    }
    return error;
};
