import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import './OrderPage.css';

const tg = window.Telegram.WebApp;

function OrderPage({ cartItems, onRemove, onAdd }) {
    const [showPopup, setShowPopup] = useState(false);
    const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const navigate = useNavigate();

    // Мемоизируем функцию handleOrder, чтобы не создавать её заново при каждом рендере
    const handleOrder = useCallback(() => {
        const orderDetails = {
            items: cartItems.map(item => ({
                id: item.id,
                name: item.title,
                quantity: item.quantity,
                price: item.price,
                total: (item.price * item.quantity).toFixed(2),
            })),
            totalPrice: totalPrice.toFixed(2),
        };

        // Симулируем отправку данных
        const simulatedData = JSON.stringify(orderDetails);
        console.log('[Simulated Data] JSON String:', simulatedData);

        // Парсим строку JSON для проверки структуры
        const parsedData = JSON.parse(simulatedData);
        console.log('[Parsed Data] Object:', parsedData);

        // Отправка данных в Telegram WebApp
        tg.sendData(simulatedData);
        setShowPopup(true);

    }, [cartItems, totalPrice]);

    useEffect(() => {
        if (cartItems.length > 0) {
            tg.MainButton.text = `ORDER $${totalPrice.toFixed(2)}`;
            tg.MainButton.show();

            tg.MainButton.onClick(handleOrder);

            return () => {
                tg.MainButton.hide();
                tg.MainButton.offClick(handleOrder);
            };
        } else {
            tg.MainButton.hide();
        }
    }, [cartItems, totalPrice, handleOrder]);

    const closeWebApp = () => {
        tg.close();
    };

    return (
        <div className="order-container">
            <div className="order-header">
                <button className="order-back-button" onClick={() => navigate(-1)}>
                    ←
                </button>
                <h2 className="order-title">YOUR ORDER</h2>
            </div>
            {cartItems.length === 0 ? (
                <p>Your cart is empty</p>
            ) : (
                <ul>
                    {cartItems.map(item => (
                        <li key={item.id} className="order-item">
                            <img src={item.image} alt={item.title} className="order-item-image" />
                            <div className="order-item-info">
                                <span className="order-item-name">{item.title}</span>
                                <div className="order-item-controls">
                                    <button className="order-item-button" onClick={() => onRemove(item)}>
                                        -
                                    </button>
                                    <span className="order-item-quantity">{item.quantity}</span>
                                    <button className="order-item-button" onClick={() => onAdd(item)}>
                                        +
                                    </button>
                                </div>
                                <span className="order-item-price">
                                    ${(item.price * item.quantity).toFixed(2)}
                                </span>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            {cartItems.length > 0 && (
                <div className="order-summary">
                    <span>Total price: ${totalPrice.toFixed(2)}</span>
                </div>
            )}

            {cartItems.length > 0 && (
                <button
                    className="simulate-button"
                    onClick={handleOrder}
                >
                    Simulate Order
                </button>
            )}

            {showPopup && (
                <div className={'popup'}>
                    <div className={'popup-content'}>
                        <p>Your order has been successfully placed!</p>
                        <button className="popup-close-button" onClick={closeWebApp}>
                            Close and return to chat
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default OrderPage;
