export const formatDate = (date) => {
    const formatedDate = `${date.split("-")[2]}.${date.split("-")[1]}.${date.split("-")[0]}`;

    return formatedDate;
};