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

    const orderData = useMemo(() => location.state?.orderData || {}, [location.state]);
    const [orderItems, setOrderItems] = useState([]);

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

    const totalPrice = orderItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    const handleOrder = useCallback(() => {
        const orderDetails = {
            items: orderItems.map((item) => ({
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
            tg.MainButton.text = 'Оформить заказ';
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
        const orderDetails = {
            items: orderItems.map((item) => ({
                id: item.id,
                name: item.title,
                quantity: item.quantity,
                price: item.price,
                total: (item.price * item.quantity).toFixed(2),
                toppings: item.toppings || [],
            })),
            totalPrice: totalPrice.toFixed(2),
        };

        console.log('Sending data to Telegram WebApp before closing:', JSON.stringify(orderDetails));
        tg.sendData(JSON.stringify(orderDetails));
        tg.close();
    };

    const increaseQuantity = (id) => {
        setOrderItems((prevItems) =>
            prevItems.map((item) =>
                item.id === id ? { ...item, quantity: item.quantity + 1 } : item
            )
        );
    };

    const decreaseQuantity = (id) => {
        setOrderItems((prevItems) =>
            prevItems.map((item) =>
                item.id === id && item.quantity > 1
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            )
        );
    };

    const containerStyle = {
        backgroundImage: `url(${
            orderData.category === 'Сырники замороженные'
                ? frozenCheese
                : preparedCheese
        })`,
    };

    return (
        <div className="order-container">
            <div className="order-header">
                <button className="order-back-button" onClick={() => navigate('/cheese')}>
                    ←
                </button>
                <h2 className="order-title">Ваш заказ</h2>
            </div>

            <div className="order-content">
                <div className="order-image" style={containerStyle}></div>
                <div className="order-details">
                    <div className="order-category">
                        <strong>Категория:</strong>
                        <span>{orderData.category}</span>
                    </div>

                    <div className="quantity-controls">
                        <strong>Количество:</strong>
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

                    <p>
                        <strong>Топпинги:</strong>{' '}
                        {orderData.toppings.length > 0
                            ? orderData.toppings
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

                    <div className="order-summary">
                        <span>Итого: {totalPrice.toLocaleString('ru-RU')} VND</span>
                    </div>
                </div>
            </div>

            {showPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <p>Ваш заказ успешно оформлен!</p>
                        <button className="popup-close-button" onClick={closeWebApp}>
                            Закрыть и вернуться в чат
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default OrderPage;
