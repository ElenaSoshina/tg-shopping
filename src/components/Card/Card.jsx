// eslint-disable-next-line no-unused-vars

import React, {useState} from 'react';
import './Card.css'
import Button from "../Button/Button";
const Card = ({food, onAdd, onRemove}) => {
    const [count, setCount] = useState(0);
    const {title, price, image, id} = food;

    const handleIncrement = () => {
        setCount(count + 1);
        onAdd(food)
    }

    const handleDecrement = () => {
        setCount(count - 1);
        onRemove(food)
    }

    return (
        <div className="card">
            <span className={`${count !== 0 ? 'card__badge' : 'card__badge--hidden'}`}>
                {count}
            </span>
            <div className="image__container">
                <img src={image} alt={title}/>
            </div>
            <h4 className="card__title">
                {title} . <span className="card__price">$ {price}</span>
            </h4>
            <div className="btn__container">
                <Button title={'+'} type={'add'} onClick={handleIncrement}/>
                {count !== 0 ? (<Button title={'-'} type={'remove'} onClick={handleDecrement}/>) : null}
            </div>
        </div>
    );
};

export default Card;