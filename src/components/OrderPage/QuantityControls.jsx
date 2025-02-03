import React from 'react';
import './QuantityControls.css'

const QuantityControls = ({ quantity, increase, decrease }) => (
    <div className='quantity-container'>
        <strong className={'quantity-controls__text'}>Количество:</strong>
        <div className="quantity-controls__gap">
            <button onClick={decrease} className={'quantity-controls__button'}>
                -
            </button>
            <span className="quantity-value">{quantity}</span>
            <button onClick={increase} className={'quantity-controls__button'}>
                +
            </button>
        </div>
    </div>
);

export default QuantityControls;
