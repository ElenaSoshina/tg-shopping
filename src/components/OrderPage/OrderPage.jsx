import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import './OrderPage.css';
import frozenCheese from '../../images/frozenCheese.jpeg';
import preparedCheese from '../../images/preparedCheese.jpeg';
import salmonSlice from '../../images/fishPage.jpeg';
import salmonPiece from '../../images/fish_slices.jpg';
import lemonImage from '../../images/lemonPage.jpeg'; // Добавлено изображение лимона
import {
    calculateTotalPrice,
    getBackgroundImage,
} from '../../utils/utils';
import QuantityControls from './QuantityControls';
import OrderSummary from './OrderSummary';
import OrderHeader from './OrderHeader';
import OrderImage from './OrderImage';
import OrderPopup from './OrderPopup';

const tg = window.Telegram.WebApp;

function OrderPage() {
    const [showPopup, setShowPopup] = useState(false);
    const [orderItems, setOrderItems] = useState([]);
    const location = useLocation();

    // Получение данных заказа
    const orderData = useMemo(() => {
        return (
            location.state?.orderData ||
            JSON.parse(sessionStorage.getItem('fishOrderData')) ||
            JSON.parse(sessionStorage.getItem('cheeseOrderData')) ||
            JSON.parse(sessionStorage.getItem('lemonOrderData')) || // Для лимона
            {}
        );
    }, [location.state]);

    // Инициализация данных заказа
    useEffect(() => {
        if (orderData?.quantity && orderData?.category) {
            setOrderItems([
                {
                    id: 'order-item',
                    title: orderData.category,
                    quantity: orderData.quantity,
                    price:
                        orderData.type === 'fish'
                            ? 160000 // Цена за 100 г рыбы
                            : orderData.type === 'lemon'
                                ? 80000 // Цена за упаковку лимонов
                                : 40000, // Цена за сырники
                    toppings: orderData.toppings || [],
                },
            ]);
        }
    }, [orderData]);

    // Подсчет общей стоимости
    const totalPrice = useMemo(() => calculateTotalPrice(orderItems), [orderItems]);

    // Обработка заказа
    const handleOrder = useCallback(() => {
        if (orderItems.length === 0) return;

        const orderDetails = {
            items: orderItems.map((item) => ({
                ...item,
                total: (item.price * item.quantity).toFixed(2),
            })),
            totalPrice: totalPrice.toFixed(2),
        };

        tg.sendData(JSON.stringify(orderDetails));
        setShowPopup(true);
    }, [orderItems, totalPrice]);

    // Увеличение количества
    const increaseQuantity = () => {
        setOrderItems((prevItems) =>
            prevItems.map((item) => ({ ...item, quantity: item.quantity + 1 }))
        );
    };

    // Уменьшение количества
    const decreaseQuantity = () => {
        setOrderItems((prevItems) =>
            prevItems.map((item) =>
                item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
            )
        );
    };

    // Управление кнопкой Telegram
    useEffect(() => {
        if (orderItems.length > 0) {
            tg.MainButton.setText('Оформить заказ');
            tg.MainButton.show();
            tg.MainButton.onClick(handleOrder);

            return () => {
                tg.MainButton.offClick(handleOrder);
                tg.MainButton.hide();
            };
        } else {
            tg.MainButton.hide();
        }
    }, [orderItems, handleOrder]);

    // Закрытие WebApp
    const closeWebApp = () => {
        tg.close();
    };

    // Установка фона для категории
    const containerStyle = {
        backgroundImage: `url(${getBackgroundImage(orderData.category, {
            frozenCheese,
            preparedCheese,
            salmonSlice,
            salmonPiece,
            lemonImage, // Добавлен лимон
        })})`,
    };

    return (
        <div className="order-container">
            {/* Заголовок */}
            <OrderHeader
                redirectPath={
                    orderData.type === 'fish'
                        ? '/fish'
                        : orderData.type === 'lemon'
                            ? '/lemon'
                            : '/cheese'
                }
            />

            {/* Контент заказа */}
            <div className="order-content">
                <OrderImage style={containerStyle} />
                <div className="order-details">
                    <div className="order-category">
                        <strong>Категория:</strong> <span>{orderData.category}</span>
                    </div>

                    <QuantityControls
                        quantity={orderItems[0]?.quantity || 0}
                        increase={increaseQuantity}
                        decrease={decreaseQuantity}
                    />

                    <OrderSummary
                        orderItems={orderItems}
                        totalPrice={totalPrice}
                        type={orderData.type}
                    />
                </div>
            </div>

            {/* Всплывающее окно */}
            {showPopup && <OrderPopup onClose={closeWebApp} />}
        </div>
    );
}

export default OrderPage;
