import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './FishPage.css';
import { IoArrowBack } from "react-icons/io5";

const tg = window.Telegram.WebApp;

function FishPage() {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [quantity, setQuantity] = useState(300); // Initial quantity
    const pricePer100Gram = 160000; // Price per 100 grams in VND
    const navigate = useNavigate();

    const quantityRef = useRef(null);

    // Handle category selection
    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        setTimeout(() => quantityRef.current?.scrollIntoView({ behavior: 'smooth' }), 300);
    };

    // Increase quantity
    const increaseQuantity = () => {
        setQuantity((prev) => prev + 100);
    };

    // Decrease quantity
    const decreaseQuantity = () => {
        setQuantity((prev) => (prev > 300 ? prev - 100 : 300));
    };

    // Calculate price based on weight
    const calculatePrice = (grams) => ((grams / 100) * pricePer100Gram).toLocaleString('ru-RU');

    useEffect(() => {
        if (selectedCategory && quantity >= 300) {
            tg.MainButton.setText('Перейти к заказу');
            tg.MainButton.show();

            tg.MainButton.onClick(() => {
                const orderData = {
                    category: selectedCategory === 'cut' ? 'Нарезка' : 'Кусок',
                    quantity,
                    type: 'fish',
                };

                sessionStorage.setItem('fishOrderData', JSON.stringify(orderData));
                navigate('/order', { state: { orderData } });
            });
        } else {
            tg.MainButton.hide();
        }

        return () => {
            tg.MainButton.offClick(() => {});
        };
    }, [selectedCategory, quantity, navigate]);

    return (
        <div className="fish-container">
            {/* Header with back button */}
            <div className="fish-header">
                <button className="fish-back-button" onClick={() => navigate('/')}>
                    <IoArrowBack size={24} /> Назад
                </button>
            </div>

            {/* Content section */}
            <div className="fish-header-content">
                <div className="fish-image-container"></div>
                <h2 className="fish-title">Норвежский лосось слабосоленый</h2>
                <p className="fish-description">
                    Приготовлен по домашнему рецепту с использованием только натуральных ингредиентов.
                    Продукт без искусственных добавок и консервантов, с приятным, деликатным вкусом.
                    <ul>
                        <li>Домашняя засолка</li>
                        <li>Низкое содержание соли</li>
                        <li>100% натуральный состав</li>
                        <li>Без консервантов и химии</li>
                        <li>Отличный вкус и текстура</li>
                    </ul>
                    Для засолки используем только среднюю широкую часть рыбы. Филе-кусочки по 300-400 г.
                </p>
            </div>

            {/* Category selection */}
            <div className="categories">
                <div
                    className={`category ${selectedCategory === 'cut' ? 'selected' : ''}`}
                    onClick={() => handleCategorySelect('cut')}
                >
                    Нарезка
                </div>
                <div
                    className={`category ${selectedCategory === 'piece' ? 'selected' : ''}`}
                    onClick={() => handleCategorySelect('piece')}
                >
                    Кусок
                </div>
            </div>

            {selectedCategory && <div className="section-divider"></div>}

            {/* Quantity selector */}
            {selectedCategory && (
                <div className="quantity-selector" ref={quantityRef}>
                    <h3>Количество (г):</h3>
                    <div className="quantity-controls">
                        <button className="quantity-button" onClick={decreaseQuantity}>
                            -
                        </button>
                        <span className="quantity-value">{quantity} г</span>
                        <button className="quantity-button" onClick={increaseQuantity}>
                            +
                        </button>
                    </div>
                    <p className="quantity-price">
                        Цена: {calculatePrice(quantity)} VND
                    </p>
                </div>
            )}
        </div>
    );
}

export default FishPage;
