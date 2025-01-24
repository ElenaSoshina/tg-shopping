import React from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div className="home-page">
            <div className="home-page__cards-container">
                {/* Карточка для "Сырников" */}
                <div className="home-page__card-container">
                    <h2 className="home-page__card-title">Сырники</h2>
                    <div
                        className="home-page__card home-page__card--syrniki"
                        onClick={() => navigate('/items')}
                    ></div>
                </div>

                {/* Карточка для "Лосося" */}
                <div className="home-page__card-container">
                    <h2 className="home-page__card-title">Лосось</h2>
                    <div
                        className="home-page__card home-page__card--fish"
                        onClick={() => navigate('/items')}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
