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

export function getBackgroundImage(category, images) {
    switch (category) {
        case 'Сырники замороженные':
            return images.frozenCheese;
        case 'Сырники приготовленные':
            return images.preparedCheese;
        case 'Нарезка':
            return images.salmonSlice;
        case 'Кусок':
            return images.salmonPiece;
        case 'Лимон': // Добавлено условие для лимона
            return images.lemonImage;
        default:
            return ''; // Возвращаем пустую строку, если категория не определена
    }
}

