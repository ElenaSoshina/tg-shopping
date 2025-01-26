import React from 'react';
import { useNavigate } from 'react-router-dom';
import './OrderPage.css'

const OrderHeader = ({ redirectPath }) => {
    const navigate = useNavigate();

    return (
        <div className="order-header">
            <button className="order-back-button" onClick={() => navigate(redirectPath)}>
                ←
            </button>
            <h2 className="order-title">Ваш заказ</h2>
        </div>
    );
};

export default OrderHeader;
