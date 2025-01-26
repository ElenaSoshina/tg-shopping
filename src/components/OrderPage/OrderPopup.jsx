import React from 'react';
import './OrderPage.css'

const OrderPopup = ({ onClose }) => {
    return (
        <div className="popup">
            <div className="popup-content">
                <p>Ваш заказ успешно оформлен!</p>
                <button className="popup-close-button" onClick={onClose}>
                    Закрыть и вернуться в чат
                </button>
            </div>
        </div>
    );
};

export default OrderPopup;
