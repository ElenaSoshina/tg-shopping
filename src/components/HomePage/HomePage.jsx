import React from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div className="home-page">
            <div className="home-page__cards-container">
                    <div className="home-page__card-container">
                        <h2 className="home-page__card-title">Сырники</h2>
                        <div
                            className="home-page__card home-page__card--syrniki"
                            onClick={() => navigate('/cheese')}
                        ></div>
                    </div>

                    <div className="home-page__card-container">
                        <h2 className="home-page__card-title">Лосось</h2>
                        <div
                            className="home-page__card home-page__card--fish"
                            onClick={() => navigate('/fish')}
                        ></div>
                    </div>

                    <div className="home-page__card-container">
                        <h2 className="home-page__card-title">Лимоны</h2>
                        <div
                            className="home-page__card home-page__card--lemons"
                            onClick={() => navigate('/lemon')}
                        ></div>
                    </div>
            </div>
        </div>
    );
};

export default HomePage;
