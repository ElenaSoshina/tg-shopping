import React from 'react';
// import { mapToppingNames } from '../../utils/utils';
import './OrderSummary.css'; // Используем отдельный CSS файл

const OrderSummary = ({ orderItems, totalPrice, type }) => {
    const finalPrice = type === 'fish' ? totalPrice / 100 : totalPrice;
    return (
        <div className="order-summary-container">
            <div className="order-summary">
                <span>Итого: {Number(finalPrice).toLocaleString('ru-RU')} VND</span>
            </div>
        </div>
    )
    }

;

export default OrderSummary;
