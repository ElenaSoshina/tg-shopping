import React from 'react';
import './QuantityControls.css'

const QuantityControls = ({ quantity, increase, decrease }) => (
    <div className="quantity-controls">
        <strong>Количество:</strong>
        <button className="quantity-button" onClick={decrease}>
            -
        </button>
        <span className="quantity-value">{quantity}</span>
        <button className="quantity-button" onClick={increase}>
            +
        </button>
    </div>
);

export default QuantityControls;
