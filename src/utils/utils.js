export const calculateTotalPrice = (orderItems) =>
    orderItems.reduce((total, item) => {
        // Определение стоимости в зависимости от типа товара
        let itemTotal = 0;
        switch (item.type) {
            case 'fish':
                // Для рыбы цена указывается за 100 грамм
                itemTotal = (item.quantity / 100) * item.price;
                break;
            case 'cheese':
            case 'lemon':
                // Для сырников и лимонов цена указывается за штуку или упаковку
                itemTotal = item.quantity * item.price;
                break;
            default:
                // Стандартный расчёт стоимости
                itemTotal = item.quantity * item.price;
                break;
        }
        return total + itemTotal;
    }, 0);


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

