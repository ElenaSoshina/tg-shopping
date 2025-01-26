import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CheesePage.css';

const tg = window.Telegram.WebApp;

function CheesePage() {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [quantity, setQuantity] = useState(0);
    const [selectedToppings, setSelectedToppings] = useState([]);
    const pricePerCheese = 40000
    const navigate = useNavigate();

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        setQuantity(0); // Сбрасываем количество при выборе новой категории
        setSelectedToppings([]); // Сбрасываем выбранные топпинги
    };

    const increaseQuantity = () => {
        setQuantity((prevQuantity) => prevQuantity + 1);
    };

    const decreaseQuantity = () => {
        setQuantity((prevQuantity) => (prevQuantity > 0 ? prevQuantity - 1 : 0));
    };

    const handleToppingSelect = (topping) => {
        setSelectedToppings((prevToppings) =>
            prevToppings.includes(topping)
                ? prevToppings.filter((item) => item !== topping) // Удаляем, если уже выбран
                : [...prevToppings, topping] // Добавляем, если не выбран
        );
    };

    useEffect(() => {
        // Показываем MainButton, если выбраны все данные
        if (selectedCategory && quantity > 0 && selectedToppings.length > 0) {
            tg.MainButton.setText('Перейти к заказу');
            tg.MainButton.show();

            tg.MainButton.onClick(() => {
                const orderData = {
                    category: selectedCategory === 'prepared' ? 'Сырники приготовленные' : 'Сырники замороженные',
                    quantity,
                    toppings: selectedToppings,
                };

                // Переход на OrderPage с передачей данных через state
                navigate('/order', { state: { orderData } });
            });
        } else {
            tg.MainButton.hide();
        }

        // Удаляем обработчик клика при размонтировании
        return () => {
            tg.MainButton.offClick(() => {});
        };
    }, [selectedCategory, quantity, selectedToppings, navigate]);

    return (
        <div className="cheese-container">
            {/* Контейнер с фоновым изображением и описанием */}
            <div className="cheese-header">
                <div className="cheese-image-container"></div>
                <p className="cheese-description">
                    Вкусные и свежие сырники с разными начинками и топпингами.
                    Выберите свою категорию и добавьте любимые добавки!
                </p>
            </div>

            {/* Категории */}
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

            {/* Секция "Количество" */}
            {selectedCategory && (
                <div className="quantity-selector">
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
                        Цена: {(quantity * pricePerCheese).toLocaleString('en-US')} VND
                    </p>
                </div>
            )}

            {selectedCategory && quantity > 0 && <div className="section-divider"></div>}

            {/* Подкатегории (Топпинги) */}
            {selectedCategory && quantity > 0 && (
                <div className="toppings">
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
