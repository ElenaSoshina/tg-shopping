import React from 'react';
import './OrderPopup.css'; // Изменил на отдельный CSS файл для Popup

const OrderPopup = ({ onClose, orderDetails }) => {
    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h2>Ваш заказ успешно оформлен!</h2>
                {orderDetails ? (
                    <div className="order-details">
                        <h3>Позиции:</h3>
                        <ul>
                            {orderDetails.items.map((item, index) => (
                                <li key={index}>
                                    <strong>{item.title}</strong> - {item.quantity} шт. - {item.total} VND
                                    {item.toppings && item.toppings.length > 0 && (
                                        <div>Топпинги: {item.toppings.join(', ')}</div>
                                    )}
                                </li>
                            ))}
                        </ul>
                        <h3>Итого: {orderDetails.totalPrice} VND</h3>
                    </div>
                ) : (
                    <p>Данные заказа недоступны.</p>
                )}
                <button className="popup-close-button" onClick={onClose}>
                    Закрыть и вернуться в чат
                </button>
            </div>
        </div>
    );
};

export default OrderPopup;
