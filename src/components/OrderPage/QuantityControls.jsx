import React from 'react';
import './QuantityControls.css'

const QuantityControls = ({ quantity, increase, decrease }) => (
    <div className='quantity-container'>
        <strong>Количество:</strong>
        <div className="quantity-controls">
            <button onClick={decrease}>
                -
            </button>
            <span className="quantity-value">{quantity}</span>
            <button onClick={increase}>
                +
            </button>
        </div>
    </div>
);

export default QuantityControls;
