// Пользовательский хук для определения, является ли устройство мобильным
import {useEffect, useState} from "react";

export function useIsMobile() {
    const [isMobile, setIsMobile] = useState(() => {
        if (typeof window !== 'undefined') {
            return window.innerWidth <= 768;
        }
        return false;
    });

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return isMobile;
}

export const calculateTotalPrice = (orderItems) => {
    return orderItems.reduce((total, item) => {
        // Ensure both quantity and price are numbers
        const quantity = Number(item.quantity);
        const price = Number(item.price);

        if (isNaN(quantity) || isNaN(price)) {
            console.error('Invalid number encountered', { quantity, price });
            return total;
        }

        let itemTotal = 0;
        switch (item.type) {
            case 'fish':
                itemTotal = (quantity / 100) * price; // price per 100 grams
                break;
            case 'cheese':
            case 'lemon':
                itemTotal = quantity * price; // price per unit or package
                break;
            default:
                itemTotal = quantity * price; // default case, price per unit
                break;
        }
        return total + itemTotal;
    }, 0);
};


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

