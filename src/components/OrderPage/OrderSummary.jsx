import React from 'react';
import { mapToppingNames } from '../../utils/utils';
import './OrderPage.css'

const OrderSummary = ({ orderItems, totalPrice, type }) => (
    <div>
        <div className="order-summary">
            <span>Итого: {totalPrice.toLocaleString('ru-RU')} VND</span>
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
