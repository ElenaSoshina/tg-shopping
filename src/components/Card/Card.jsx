

import React from 'react';
import './Card.css'
import Button from "../ui/Button/Button";
const Card = ({food, onAdd, onRemove, cartItems}) => {
    const cartItem = cartItems.find(item => item.id === food.id);
    const count = cartItem ? cartItem.quantity : 0

    const handleIncrement = () => {
        onAdd(food)
    }

    const handleDecrement = () => {
        onRemove(food)
    }

    return (
        <div className="card">
            <span className={`${count !== 0 ? 'card__badge' : 'card__badge--hidden'}`}>
                {count}
            </span>
            <div className="image__container">
                <img src={food.image} alt={food.title}/>
            </div>
            <h4 className="card__title">
                {food.title} . <span className="card__price">$ {food.price}</span>
            </h4>
            <div className="btn__container">
                <Button title={'+'} type={'add'} onClick={handleIncrement}/>
                {count !== 0 ? (<Button title={'-'} type={'remove'} onClick={handleDecrement}/>) : null}
            </div>
        </div>
    );
};

export default Card;