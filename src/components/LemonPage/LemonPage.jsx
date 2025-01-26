import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './LemonPage.css';
import { IoArrowBack } from "react-icons/io5";

const tg = window.Telegram.WebApp;

function LemonPage() {
    const [quantity, setQuantity] = useState(1); // Initial quantity in packages
    const pricePerPackage = 80000; // Price per package in VND
    const navigate = useNavigate();

    const quantityRef = useRef(null);

    // Increase quantity
    const increaseQuantity = () => {
        setQuantity((prev) => prev + 1);
    };

    // Decrease quantity
    const decreaseQuantity = () => {
        setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
    };

    // Calculate price based on quantity
    const calculatePrice = (quantity) => (quantity * pricePerPackage).toLocaleString('ru-RU');

    useEffect(() => {
        if (quantity >= 1) {
            tg.MainButton.setText('Перейти к заказу');
            tg.MainButton.show();

            tg.MainButton.onClick(() => {
                const orderData = {
                    category: 'Лимон',
                    quantity,
                    totalPrice: calculatePrice(quantity),
                    type: 'lemon',
                };

                sessionStorage.setItem('lemonOrderData', JSON.stringify(orderData));
                navigate('/order', { state: { orderData } });
            });
        } else {
            tg.MainButton.hide();
        }

        return () => {
            tg.MainButton.offClick(() => {});
        };
    }, [quantity, navigate]);

    return (
        <div className="lemon-container">
            {/* Header with back button */}
            <div className="lemon-header">
                <button className="lemon-back-button" onClick={() => navigate('/')}>
                    <IoArrowBack size={24} /> Назад
                </button>
            </div>

            {/* Content section */}
            <div className="lemon-header-content">
                <div className="lemon-image-container"></div>
                <h2 className="lemon-title">Свежий лимон с сочной, желтой цедрой.</h2>
                <p className="lemon-description">
                    Свежий лимон с сочной, желтой цедрой.
                    <br /><br />
                    Лимон обладает антитоксическим действием, уменьшает повреждение и защищает вашу печень.
                    Помогает пищеварительной системе организма работать должным образом.
                    <br /><br />
                    Ежедневное употребление воды с лимоном помогает бороться с жировыми отложениями, восстанавливать силы во время и после тренировок.
                    <br /><br />
                    Кроме того, сочная желтая цедра лимона подходит для декорации различных блюд.
                    <br /><br />
                    Упаковка 600-700 гр.
                </p>
            </div>

            {/* Quantity selector */}
            <div className="quantity-selector" ref={quantityRef}>
                <h3>Количество упаковок:</h3>
                <div className="quantity-controls">
                    <button className="quantity-button" onClick={decreaseQuantity}>
                        -
                    </button>
                    <span className="quantity-value">{quantity}</span>
                    <button className="quantity-button" onClick={increaseQuantity}>
                        +
                    </button>
                </div>
                <p className="quantity-price">
                    Цена: {calculatePrice(quantity)} VND
                </p>
            </div>
        </div>
    );
}

export default LemonPage;
