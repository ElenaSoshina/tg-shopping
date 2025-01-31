import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import OrderPage from "./components/OrderPage/OrderPage";
import NavigateHandler from "./services/navigate/navigateHandler";
import LocationHandler from "./services/navigate/locationHandler";
import HomePage from "./components/HomePage/HomePage";
import CheesePage from "./components/CheesePage/CheesePage";
import FishPage from "./components/FishPage/FishPage";
import LemonPage from "./components/LemonPage/LemonPage";



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
            updateMainButton("VIEW ORDER", true);
        } else {
            updateMainButton("", false);
        }
    }, [cartItems]);

    const onAdd = (food) => {
        const exist = cartItems.find((x) => x.id === food.id);
        if (exist) {
            setCartItems(
                cartItems.map((x) =>
                    x.id === food.id ? { ...exist, quantity: exist.quantity + 1 } : x
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
                    x.id === food.id ? { ...exist, quantity: exist.quantity - 1 } : x
                )
            );
        }
    };

    // Функция для обновления состояния MainButton
    const updateMainButton = (text, visible) => {
        if (visible) {
            tg.MainButton.setText(text);
            tg.MainButton.show();
        } else {
            tg.MainButton.hide();
        }
    };

    return (
        <Router basename="/tg-shopping">
            <NavigateHandler />
            <LocationHandler setCartButtonVisibility={updateMainButton} />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/cheese" element={<CheesePage />} />
                <Route path="/fish" element={<FishPage />} />
                <Route path="/lemon" element={<LemonPage />} />
                <Route path="/order" element={<OrderPage cartItems={cartItems} onRemove={onRemove} onAdd={onAdd} webAppQueryId={webAppQueryId} />} />
            </Routes>
        </Router>
    );
}

export default App;
