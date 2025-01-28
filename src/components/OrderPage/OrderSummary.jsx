import React from 'react';
import { mapToppingNames } from '../../utils/utils';
import './OrderSummary.css'; // Используем отдельный CSS файл

const OrderSummary = ({ orderItems, totalPrice, type }) => (
    <div className="order-summary-container">
        <div className="order-summary">
            <span>Итого: {Number(totalPrice).toLocaleString('ru-RU')} VND</span>
        </div>
        {type !== 'fish' && (
            <p>
                <strong>Топпинги:</strong>{' '}
                {orderItems[0]?.toppings?.length > 0
                    ? mapToppingNames(orderItems[0].toppings).join(', ')
                    : 'Нет'}
            </p>
        )}
    </div>
);

export default OrderSummary;
