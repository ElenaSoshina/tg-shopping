import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Card from "./components/Card/Card";
import Cart from "./components/Cart/Cart";
import OrderPage from "./components/OrderPage/OrderPage";
import NavigateHandler from "./services/navigate/navigateHandler";
import LocationHandler from "./services/navigate/locationHandler";
import HomePage from "./components/HomePage/HomePage";
import CheesePage from "./components/CheesePage/CheesePage";
import FishPage from "./components/FishPage/FishPage";
import LemonPage from "./components/LemonPage/LemonPage";

const { getData } = require("./db/db");
const foods = getData();

// Инициируем доступ к Telegram WebApp API
const tg = window.Telegram.WebApp;

function App() {
    const [cartItems, setCartItems] = useState([]);
    const [webAppQueryId, setWebAppQueryId] = useState('');

    // Получаем web_app_query_id из URL и сообщаем Telegram, что Web App готово
    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const queryId = queryParams.get('query_id');
        setWebAppQueryId(queryId);

        tg.ready();
    }, []);

    useEffect(() => {
        const savedCartItems = JSON.parse(sessionStorage.getItem("cartItems"));
        if (savedCartItems) {
            setCartItems(savedCartItems);
        }
    }, []);

    useEffect(() => {
        if (cartItems.length > 0) {
            sessionStorage.setItem("cartItems", JSON.stringify(cartItems));
        }
    }, [cartItems]);

    // Показываем / скрываем кнопку «VIEW ORDER» на главной странице
    useEffect(() => {
        if (cartItems.length > 0) {
            tg.MainButton.setText("VIEW ORDER");
            tg.MainButton.show();
        } else {
            tg.MainButton.hide();
        }
    }, [cartItems]);

    const onAdd = (food) => {
        const exist = cartItems.find((x) => x.id === food.id);
        if (exist) {
            setCartItems(
                cartItems.map((x) =>
                    x.id === food.id
                        ? { ...exist, quantity: exist.quantity + 1 }
                        : x
                )
            );
        } else {
            setCartItems([...cartItems, { ...food, quantity: 1 }]);
        }
    };

    const onRemove = (food) => {
        const exist = cartItems.find((x) => x.id === food.id);
        if (exist.quantity === 1) {
            setCartItems(cartItems.filter((x) => x.id !== food.id));
        } else {
            setCartItems(
                cartItems.map((x) =>
                    x.id === food.id
                        ? { ...exist, quantity: exist.quantity - 1 }
                        : x
                )
            );
        }
    };

    // Управление видимостью кнопки из разных компонентов
    const handleCartButtonVisibility = (visible) => {
        if (visible) {
            tg.MainButton.show();
        } else {
            tg.MainButton.hide();
        }
    };

    return (
        <Router>
            {/* Отслеживание переходов и управление навигацией */}
            <NavigateHandler />
            <LocationHandler
                setCartButtonVisibility={handleCartButtonVisibility}
            />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route
                    path="/items"
                    element={
                        <>
                            <h1 className="heading">Order food</h1>
                            <Cart cartItems={cartItems} />
                            <div className="cards__container">
                                {foods.map((food) => (
                                    <Card
                                        food={food}
                                        key={food.id}
                                        onAdd={onAdd}
                                        onRemove={onRemove}
                                        cartItems={cartItems}
                                    />
                                ))}
                            </div>
                        </>
                    }
                />
                {/* Страница выбора сырников */}
                <Route path="/cheese" element={<CheesePage />} />
                <Route path="/fish" element={<FishPage />} />
                <Route path="/lemon" element={<LemonPage />} />
                <Route
                    path="/order"
                    element={
                        <OrderPage cartItems={cartItems} onRemove={onRemove} onAdd={onAdd} />
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
