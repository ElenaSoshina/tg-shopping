import React, {useState, useEffect, useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import './CheesePage.css';
import {IoArrowBack} from "react-icons/io5";
import Carousel from "../ui/Carousel/Carousel";
import { useIsMobile} from "../../utils/utils";
import {applyThemeColors} from "../ui/theme";

const tg = window.Telegram.WebApp;

function CheesePage() {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [quantity, setQuantity] = useState(0);
    const [selectedToppings, setSelectedToppings] = useState([]);
    const navigate = useNavigate();
    const maxQuantity = 40;

    // Минимальное количество
    const minQuantityPrepared = 4;
    const minQuantityFrozen = 10;

    // Цена за один сырник
    const pricePerPreparedCheese = 40000;
    const pricePerFrozenCheese = 30000;

    // Рефы для секций
    const quantityRef = useRef(null);
    const toppingsRef = useRef(null);

    const images = [
        require('../../images/syrniki-5.webp'),
        require('../../images/syrniki-4.webp'),
        require('../../images/syrniki-3.webp'),
        require('../../images/syrniki-2.webp'),
        require('../../images/syrinki-1.webp'),
    ];

    const isMobile = useIsMobile(); // Определяем тип устройства

    useEffect(() => {
        applyThemeColors(); // Устанавливаем тему при загрузке
        tg.onEvent("themeChanged", applyThemeColors);

        return () => {
            tg.offEvent("themeChanged", applyThemeColors);
        };
    }, []);

    // Обработчик выбора категории
    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        setQuantity(category === 'prepared' ? minQuantityPrepared : minQuantityFrozen);
        setSelectedToppings([]);
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

    // Уменьшение количества (не ниже минимального)
    const decreaseQuantity = () => {
        setQuantity((prev) => {
            const minQty = selectedCategory === 'prepared' ? minQuantityPrepared : minQuantityFrozen;
            return prev > minQty ? prev - 1 : minQty;
        });
    };

    // Обработчик выбора топпинга
    const handleToppingSelect = (topping) => {
        setSelectedToppings((prev) => {
            const updatedToppings = prev.includes(topping)
                ? prev.filter((item) => item !== topping) // Удаление топпинга
                : [...prev, topping]; // Добавление топпинга

            // Осуществляем скролл после обновления состояния
            setTimeout(() => {
                toppingsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 300);

            return updatedToppings;
        });
    };

    useEffect(() => {
        // Прокрутка в верх страницы при инициализации компонента
        window.scrollTo(0, 0);
    }, []);

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
                    price: pricePerCheese * quantity,
                    toppings: selectedToppings,
                    type: 'cheese',
                    image: selectedCategory === 'prepared' ? require('../../images/preparedCheese.webp') : require('../../images/frozenCheese.webp'),
                };

                sessionStorage.setItem('cheeseOrderData', JSON.stringify(orderData));
                navigate('/order', { state: { orderData } });
            });
        } else {
            tg.MainButton.hide();
        }

        return () => tg.MainButton.offClick(() => {});
    }, [selectedCategory, quantity, selectedToppings, navigate]);

    const pricePerCheese = selectedCategory === 'prepared' ? pricePerPreparedCheese : pricePerFrozenCheese;
    const totalPrice = quantity * pricePerCheese;

    return (
        <div className="cheese-container">
            {/* Заголовок с кнопкой назад */}
            <div className="cheese-header">
                <button className="cheese-back-button" onClick={() => navigate('/')}>
                    <IoArrowBack size={24} />
                </button>
            </div>
            <Carousel images={images} showArrows={!isMobile}/>
            <p className="cheese-description">
                Продукт без искусственных добавок и консервантов с приятным вкусом.<br/><br/>

                Отлично подойдет на завтрак!<br/><br/>

                <ul>
                    <li>Доля творога в одном сырнике — <strong>90%</strong>.</li>
                    <li>Низкое содержание соли и сахара.</li>
                    <li>Без консервантов и химии.</li>
                    <li>Яйцо и мука используются <em>только</em> для формовки — отличный вкус и текстура.</li>
                </ul>

                <p>Жирность творога: <strong>14-16%</strong>.<br/>
                    Вес одного сырника: <strong>47 г</strong>.</p>

                <p>Сырники любим всем сердцем ❤️<br/>
                    И готовим их для себя.</p>
            </p>
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
                        <button className="quantity-button" onClick={increaseQuantity} disabled={quantity >= maxQuantity}>
                            +
                        </button>
                    </div>
                    <p className="quantity-price">
                        Цена: {totalPrice.toLocaleString('ru-RU')} VND
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
                            Йогурт
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
