export const formatDate = (date) => {
    if(!date) {
        return "";
    }
    const formatedDate = `${date.split("-")[2]}.${date.split("-")[1]}.${date.split("-")[0]}`;

    return formatedDate;
};