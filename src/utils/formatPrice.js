export const formatPrice = (arr) => {
    const formatedArr = arr.map(item => {
        const parsedPrice = parseFloat(item.price.replaceAll(/[^\d.,]/g, "").replace(",", "."));
        const formatedPrice = parsedPrice.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        return {
                name: item.name,
                price: formatedPrice,
                amount: item.amount,
                subtotal: item.subtotal
            };
    });
    return formatedArr;
};