import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import './OrderPage.css';
import frozenCheese from '../../images/frozenCheese.jpeg';
import preparedCheese from '../../images/preparedCheese.jpeg';
import salmonSlice from '../../images/fishPage.jpeg';
import salmonPiece from '../../images/fish_slices.jpg';
import lemonImage from '../../images/lemonPage.jpeg';

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
    const [orderDetails, setOrderDetails] = useState(null); // Добавлено состояние для данных заказа
    const location = useLocation();

    // Достаём данные из state или из sessionStorage
    const orderData = useMemo(() => {
        return (
            location.state?.orderData ||
            JSON.parse(sessionStorage.getItem('fishOrderData')) ||
            JSON.parse(sessionStorage.getItem('cheeseOrderData')) ||
            JSON.parse(sessionStorage.getItem('lemonOrderData')) ||
            {}
        );
    }, [location.state]);

    // Заполняем данные заказа
    useEffect(() => {
        if (orderData?.quantity && orderData?.category) {
            setOrderItems([
                {
                    id: 'order-item',
                    title: orderData.category,
                    quantity: orderData.quantity,
                    price:
                        orderData.type === 'fish'
                            ? 160000
                            : orderData.type === 'lemon'
                                ? 80000
                                : 40000,
                    toppings: orderData.toppings || [],
                },
            ]);
        }
    }, [orderData]);

    // Считаем итоговую стоимость
    const totalPrice = useMemo(
        () => calculateTotalPrice(orderItems),
        [orderItems]
    );

    // Обработка оформления заказа
    const handleOrder = useCallback(() => {
        if (orderItems.length === 0) return;

        const details = {
            items: orderItems.map((item) => ({
                ...item,
                total: (item.price * item.quantity).toFixed(2),
            })),
            totalPrice: totalPrice.toFixed(2),
        };

        console.log('Отправка данных заказа:', details); // Добавлено

        // Сохраняем данные заказа для отображения в Popup
        setOrderDetails(details);

        // Отправляем данные в бота
        tg.sendData(JSON.stringify(details));

        setShowPopup(true);
    }, [orderItems, totalPrice]);

    // Изменение количества
    const increaseQuantity = () => {
        setOrderItems((prevItems) =>
            prevItems.map((item) => ({
                ...item,
                quantity: item.quantity + 1,
            }))
        );
    };

    const decreaseQuantity = () => {
        setOrderItems((prevItems) =>
            prevItems.map((item) =>
                item.quantity > 1
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            )
        );
    };

    // Включаем MainButton и подвешиваем обработчик нажатия
    useEffect(() => {
        if (orderItems.length > 0) {
            tg.MainButton.setText('Оформить заказ');
            tg.MainButton.show();
            tg.MainButton.onClick(handleOrder);

            return () => {
                // Отключаем обработчик при размонтаже
                tg.MainButton.offClick(handleOrder);
                tg.MainButton.hide();
            };
        } else {
            tg.MainButton.hide();
        }
    }, [orderItems, handleOrder]);

    const closeWebApp = () => {
        tg.close();
    };

    // Подбираем фон
    const containerStyle = {
        backgroundImage: `url(${getBackgroundImage(orderData.category, {
            frozenCheese,
            preparedCheese,
            salmonSlice,
            salmonPiece,
            lemonImage,
        })})`,
    };

    return (
        <div className="order-container">
            <OrderHeader
                redirectPath={
                    orderData.type === 'fish'
                        ? '/fish'
                        : orderData.type === 'lemon'
                            ? '/lemon'
                            : '/cheese'
                }
            />

            <div className="order-content">
                <OrderImage style={containerStyle} />
                <div className="order-details">
                    <div className="order-category">
                        <strong>Категория:</strong> <span>{orderData.category}</span>
                    </div>

                    <QuantityControls
                        quantity={orderItems[0]?.quantity || 1}
                        increase={increaseQuantity}
                        decrease={decreaseQuantity}
                    />

                    {/* Отображаем топпинги только для сырников */}
                    {orderData.type === 'cheese' && (
                        <p>
                            <strong>Топпинги:</strong>{' '}
                            {orderItems[0]?.toppings?.length
                                ? orderItems[0].toppings
                                    .map((topping) => {
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
                                    })
                                    .join(', ')
                                : 'Нет'}
                        </p>
                    )}

                    <OrderSummary
                        orderItems={orderItems}
                        totalPrice={totalPrice}
                        type={orderData.type}
                    />
                </div>
            </div>

            {/* Попап после успешного заказа с отображением данных */}
            {showPopup && <OrderPopup onClose={closeWebApp} orderDetails={orderDetails} />}
        </div>
    );
}

export default OrderPage;
