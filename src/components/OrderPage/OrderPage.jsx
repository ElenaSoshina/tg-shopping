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
                    id: 'cheese-order', // Уникальный идентификатор
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

        // Сохраняем данные для отправки
        const simulatedData = JSON.stringify(orderDetails);
        console.log('[Simulated Data] JSON String:', simulatedData);

        // Показываем модальное окно
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

        // Отправка данных перед закрытием
        const simulatedData = JSON.stringify(orderDetails);
        console.log('Sending data to Telegram WebApp before closing:', simulatedData);
        tg.sendData(simulatedData);

        // Закрываем приложение
        tg.close();
    };

    // Обработчики изменения количества
    const increaseQuantity = (id) => {
        setOrderItems((prevItems) =>
            prevItems.map((item) =>
                item.id === id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
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

    // Определяем стиль фона в зависимости от категории
    const containerStyle = {
        backgroundImage: `url(${
            orderData.category === 'Сырники замороженные'
                ? frozenCheese
                : preparedCheese
        })`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: '12px',
        height: '200px',
        width: '100%',
        maxWidth: '100px',
        marginBottom: '20px',
        textAlign: 'center',
    };

    return (
        <div className="order-container">
            <div className="order-header">
                <button className="order-back-button" onClick={() => navigate(-1)}>
                    ←
                </button>
                <h2 className="order-title">Ваш заказ</h2>
            </div>

            {/* Проверяем наличие данных заказа */}
            {Object.keys(orderData).length === 0 ? (
                <p className="order-empty">Нет данных для отображения заказа</p>
            ) : (
                <div className="order-details">
                    <div style={containerStyle}></div>

                    {/* Категория */}
                    <p><strong>Категория:</strong> {orderData.category}</p>

                    {/* Количество */}
                    <div className="quantity__selector">
                        <h3>Количество:</h3>
                        <div className="quantity-controls">
                            <button
                                className="quantity-button"
                                onClick={() => decreaseQuantity(orderItems[0]?.id)}
                            >
                                -
                            </button>
                            <span className="quantity-value">{orderItems[0]?.quantity} шт.</span>
                            <button
                                className="quantity-button"
                                onClick={() => increaseQuantity(orderItems[0]?.id)}
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Топпинги */}
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
            )}

            {orderItems.length > 0 && (
                <div className="order-summary">
                    <span>Итого: {totalPrice.toLocaleString('ru-RU')} VND</span>
                </div>
            )}

            {showPopup && (
                <div className={'popup'}>
                    <div className={'popup-content'}>
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
