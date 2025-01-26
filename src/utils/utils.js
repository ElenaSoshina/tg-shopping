export const calculateTotalPrice = (orderItems) =>
    orderItems.reduce((total, item) => total + item.price * item.quantity, 0);

export const mapToppingNames = (toppings) =>
    toppings.map((topping) => {
        switch (topping) {
            case 'sourCream':
                return 'Сметана';
            case 'condensedMilk':
                return 'Сгущенка';
            case 'passionFruitJam':
                return 'Джем из маракуйи';
            default:
                return 'Неизвестный топпинг';
        }
    });

export const getBackgroundImage = (category, images) => {
    const { frozenCheese, preparedCheese, salmonSlice, salmonPiece } = images;
    return category === 'Сырники замороженные'
        ? frozenCheese
        : category === 'Сырники приготовленные'
            ? preparedCheese
            : category === 'Нарезка'
                ? salmonSlice
                : salmonPiece;
};
