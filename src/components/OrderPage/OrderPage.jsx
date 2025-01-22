import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import './OrderPage.css'

const tg = window.Telegram.WebApp;

function OrderPage({ cartItems, onRemove, onAdd }) {
    const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const navigate = useNavigate();

    useEffect(() => {
        if (cartItems.length > 0) {
            tg.MainButton.text = `ORDER $${totalPrice.toFixed(2)}`;
            tg.MainButton.show();

            const handleOrder = () => {
                const orderDetails = {
                    items: cartItems.map(item => ({
                        id: item.id,
                        name: item.title,
                        quantity: item.quantity,
                        total: (item.price * item.quantity).toFixed(2),
                    })),
                    totalPrice: totalPrice.toFixed(2),
                };

                if (window.confirm("Order placed successfully!")) {
                    tg.sendData(JSON.stringify(orderDetails));
                }
            };

            tg.MainButton.onClick(handleOrder);

            return () => {
                tg.MainButton.hide();
                tg.MainButton.offClick(handleOrder);
            };
        } else {
            tg.MainButton.hide();
        }
    }, [cartItems, totalPrice]);

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
        </div>
    );
}

export default OrderPage;
