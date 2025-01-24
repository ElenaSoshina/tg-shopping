import React from 'react';
import './Button.css'
const Button = ({type, disable, title, onClick}) => {
    return (
        <button className={`btn ${
            (type === 'add' && 'add') || 
            (type === 'remove' && 'remove') || 
            (type === 'checkout' && 'checkout')}`
        }
        disabled={disable}
        onClick={onClick}>
            {title}
        </button>
    );
};

export default Button;