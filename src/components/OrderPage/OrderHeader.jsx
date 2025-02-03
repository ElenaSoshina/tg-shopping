import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';

function OrderHeader({ redirectPath }) {
    const navigate = useNavigate();

    const handleBack = () => {
        if (window.history.length > 1) {
            navigate(-1); // Возвращаем пользователя на предыдущую страницу
        } else {
            navigate(redirectPath || '/'); // Переход на домашнюю страницу, если истории нет
        }
    };

    return (
        <div className="order-header">
            <button className="order-back-button" onClick={handleBack}>
                <IoArrowBack size={24} />
            </button>
            <h2 className="order-title">Ваш заказ</h2>
        </div>
    );
}

export default OrderHeader;
