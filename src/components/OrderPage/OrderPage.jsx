import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './OrderPage.css';
import frozenCheese from '../../images/frozenCheese.jpeg';
import preparedCheese from '../../images/preparedCheese.jpeg';

const tg = window.Telegram.WebApp;

function OrderPage({ cartItems, onRemove, onAdd }) {
    const [showPopup, setShowPopup] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Получаем данные заказа из CheesePage
    const orderData = useMemo(() => location.state?.orderData || {}, [location.state]);
    const [orderItems, setOrderItems] = useState([]);

    // Если данные переданы из CheesePage, добавляем их в список заказа
    useEffect(() => {
        if (orderData?.quantity && orderData?.category) {
            setOrderItems([
                {
                    id: 'cheese-order',
                    title: orderData.category,
                    quantity: orderData.quantity,
                    price: 40000,
                    toppings: orderData.toppings,
                },
            ]);
        }
    }, [orderData]);

    // Подсчет общей стоимости
    const totalPrice = orderItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    const handleOrder = useCallback(() => {
        const orderDetails = {
            items: orderItems.map(item => ({
                id: item.id,
                name: item.title,
                quantity: item.quantity,
                price: item.price,
                total: (item.price * item.quantity).toFixed(2),
                toppings: item.toppings || [],
            })),
            totalPrice: totalPrice.toFixed(2),
        };

        console.log('[Simulated Data] JSON String:', JSON.stringify(orderDetails));
        setShowPopup(true);
    }, [orderItems, totalPrice]);

    useEffect(() => {
        if (orderItems.length > 0) {
            tg.MainButton.text = `Оформить заказ`;
            tg.MainButton.show();

            tg.MainButton.onClick(handleOrder);

            return () => {
                tg.MainButton.hide();
                tg.MainButton.offClick(handleOrder);
            };
        } else {
            tg.MainButton.hide();
        }
    }, [orderItems, totalPrice, handleOrder]);

    const closeWebApp = () => {
        tg.sendData('Order confirmed');
        tg.close();
    };

    // Определяем стиль фона для картинки
    const containerStyle = {
        backgroundImage: `url(${
            orderData.category === 'Сырники замороженные'
                ? frozenCheese
                : preparedCheese
        })`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: '12px',
    };

    return (
        <div className="order-container">
            <div className="order-content">
                {/* Картинка */}
                <div className="order-image" style={containerStyle}></div>

                {/* Информация о заказе */}
                <div className="order-details">
                    <h2>Ваш заказ</h2>
                    <p><strong>Категория:</strong> {orderData.category}</p>
                    <div className="quantity-selector">
                        <h3>Количество:</h3>
                        <div className="quantity-controls">
                            <button
                                className="quantity-button"
                                onClick={() => decreaseQuantity(orderItems[0]?.id)}
                            >
                                -
                            </button>
                            <span className="quantity-value">{orderItems[0]?.quantity}</span>
                            <button
                                className="quantity-button"
                                onClick={() => increaseQuantity(orderItems[0]?.id)}
                            >
                                +
                            </button>
                        </div>
                        <p><strong>Цена:</strong> {totalPrice.toLocaleString('ru-RU')} VND</p>
                    </div>
                    <p>
                        <strong>Топпинги:</strong>{' '}
                        {orderData.toppings.length > 0
                            ? orderData.toppings
                                .map((topping) => {
                                    if (topping === 'sourCream') return 'Сметана';
                                    if (topping === 'condensedMilk') return 'Сгущенка';
                                    if (topping === 'passionFruitJam') return 'Джем из маракуйи';
                                    return '';
                                })
                                .join(', ')
                            : 'Нет'}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default OrderPage;
