import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './CheesePage.css';
import { IoArrowBack } from "react-icons/io5";

const tg = window.Telegram.WebApp;

function CheesePage() {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [quantity, setQuantity] = useState(0);
    const [selectedToppings, setSelectedToppings] = useState([]);
    const pricePerCheese = 40000; // Цена за один сырник
    const navigate = useNavigate();

    // Рефы для секций
    const quantityRef = useRef(null);
    const toppingsRef = useRef(null);

    // Обработчик выбора категории
    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        setQuantity(0); // Сброс количества
        setSelectedToppings([]); // Сброс топпингов

        // Прокрутка к секции количества
        setTimeout(() => quantityRef.current?.scrollIntoView({ behavior: 'smooth' }), 300);
    };

    // Увеличение количества
    const increaseQuantity = () => {
        setQuantity((prev) => prev + 1);

        // Прокрутка к секции топпингов
        if (quantity === 0) {
            setTimeout(() => toppingsRef.current?.scrollIntoView({ behavior: 'smooth' }), 300);
        }
    };

    // Уменьшение количества
    const decreaseQuantity = () => {
        setQuantity((prev) => (prev > 0 ? prev - 1 : 0));
    };

    // Обработчик выбора топпинга
    const handleToppingSelect = (topping) => {
        setSelectedToppings((prev) =>
            prev.includes(topping)
                ? prev.filter((item) => item !== topping) // Удаление топпинга
                : [...prev, topping] // Добавление топпинга
        );
    };

    // Загрузка данных из sessionStorage при монтировании
    useEffect(() => {
        const savedData = JSON.parse(sessionStorage.getItem('cheeseOrderData'));
        if (savedData) {
            setSelectedCategory(savedData.category === 'Сырники приготовленные' ? 'prepared' : 'frozen');
            setQuantity(savedData.quantity);
            setSelectedToppings(savedData.toppings || []);
        }
    }, []);

    // Управление кнопкой Telegram
    useEffect(() => {
        if (selectedCategory && quantity > 0 && selectedToppings.length > 0) {
            tg.MainButton.setText('Перейти к заказу');
            tg.MainButton.show();

            tg.MainButton.onClick(() => {
                const orderData = {
                    category: selectedCategory === 'prepared' ? 'Сырники приготовленные' : 'Сырники замороженные',
                    quantity,
                    toppings: selectedToppings,
                    type: 'cheese',
                };

                sessionStorage.setItem('cheeseOrderData', JSON.stringify(orderData));
                navigate('/order', { state: { orderData } });
            });
        } else {
            tg.MainButton.hide();
        }

        return () => tg.MainButton.offClick(() => {});
    }, [selectedCategory, quantity, selectedToppings, navigate]);

    return (
        <div className="cheese-container">
            {/* Заголовок с кнопкой назад */}
            <div className="cheese-header">
                <button className="cheese-back-button" onClick={() => navigate('/')}>
                    <IoArrowBack size={24} /> Назад
                </button>
                <div className="cheese-image-container"></div>
                <p className="cheese-description">
                    Вкусные и свежие сырники с разными начинками и топпингами.
                    Выберите свою категорию и добавьте любимые добавки!
                </p>
            </div>

            {/* Секция выбора категории */}
            <div className="categories">
                <div
                    className={`category ${selectedCategory === 'prepared' ? 'selected' : ''}`}
                    onClick={() => handleCategorySelect('prepared')}
                >
                    Сырники приготовленные
                </div>
                <div
                    className={`category ${selectedCategory === 'frozen' ? 'selected' : ''}`}
                    onClick={() => handleCategorySelect('frozen')}
                >
                    Сырники замороженные
                </div>
            </div>

            {selectedCategory && <div className="section-divider"></div>}

            {/* Секция выбора количества */}
            {selectedCategory && (
                <div className="quantity-selector" ref={quantityRef}>
                    <h3>Количество:</h3>
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
                        Цена: {(quantity * pricePerCheese).toLocaleString('ru-RU')} VND
                    </p>
                </div>
            )}

            {selectedCategory && quantity > 0 && <div className="section-divider"></div>}

            {/* Секция выбора топпингов */}
            {selectedCategory && quantity > 0 && (
                <div className="toppings" ref={toppingsRef}>
                    <h3>Выберите топпинги:</h3>
                    <div className="topping-options">
                        <div
                            className={`topping ${selectedToppings.includes('sourCream') ? 'selected' : ''}`}
                            onClick={() => handleToppingSelect('sourCream')}
                        >
                            Сметана
                        </div>
                        <div
                            className={`topping ${selectedToppings.includes('condensedMilk') ? 'selected' : ''}`}
                            onClick={() => handleToppingSelect('condensedMilk')}
                        >
                            Сгущенка
                        </div>
                        <div
                            className={`topping ${selectedToppings.includes('passionFruitJam') ? 'selected' : ''}`}
                            onClick={() => handleToppingSelect('passionFruitJam')}
                        >
                            Джем из маракуйи
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CheesePage;
