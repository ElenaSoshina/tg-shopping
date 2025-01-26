import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './FishPage.css';
import {IoArrowBack} from "react-icons/io5";

const tg = window.Telegram.WebApp;

function FishPage() {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [quantity, setQuantity] = useState(300); // Initial quantity is 300g
    const pricePer100Gram = 160000; // Price per gram in VND
    const navigate = useNavigate();

    const quantityRef = useRef(null);

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);

        setTimeout(() => quantityRef.current?.scrollIntoView({ behavior: 'smooth' }), 300);
    };

    const increaseQuantity = () => {
        setQuantity((prevQuantity) => prevQuantity + 100);
    };

    const decreaseQuantity = () => {
        setQuantity((prevQuantity) => (prevQuantity > 300 ? prevQuantity - 100 : 300));
    };

    const calculatePrice = (grams) => {
        return ((grams/100) * pricePer100Gram).toLocaleString('ru-RU')
    }

    useEffect(() => {
        if (selectedCategory && quantity >= 300) {
            tg.MainButton.setText('Перейти к заказу');
            tg.MainButton.show();

            tg.MainButton.onClick(() => {
                const orderData = {
                    category: selectedCategory === 'cut' ? 'Нарезка' : 'Кусок',
                    quantity,
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
            {/* Back Arrow */}
            <div className="fish-header">
                <button className="fish-back-button" onClick={() => navigate('/')}>
                    <IoArrowBack size={24}/> Назад
                </button>

            </div>

            <div className="fish-header-content">
                <div className="fish-image-container"></div>
                <h2 className="fish-title">Норвежский лосось слабосоленый</h2>
                <p className="fish-description">
                    Приготовлен по домашнему рецепту с использованием только натуральных ингредиентов.
                    Продукт без искусственных добавок и консервантов, с приятным, деликатным вкусом.
                    <br/>
                    <br/>
                    Отлично подойдет для закусок, салатов и канапе.
                    <ul>
                        <li>Домашняя засолка</li>
                        <li>Низкое содержание соли</li>
                        <li>100% натуральный состав</li>
                        <li>Без консервантов и химии</li>
                        <li>Отличный вкус и текстура</li>
                    </ul>
                    Для засолки используем только среднюю широкую часть рыбы. Филе-кусочки по 300-400 гр.
                </p>
            </div>

            {/* Категории */}
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

            {/* Секция "Количество" */}
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
