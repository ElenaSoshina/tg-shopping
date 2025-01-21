import React from 'react';
import './Cart.css'
import Button from "../Button/Button";
import { useNavigate } from 'react-router-dom'

const Cart = ({cartItems, onCheckout}) => {
    const navigate = useNavigate()

    const totalPrice = cartItems.reduce((a, c) => a + c.price * c.quantity, 0)

    return (
        <div className={'cart__container'}>
            {cartItems.length === 0 ? (<p>No items in cart</p>) : (
                <>
                 <br/>
                 <span>Total price: ${totalPrice.toFixed(2)}</span>
                </>
            )}
            <Button title={cartItems.length === 0 ? "Order" : "Checkout"}
            type={"checkout"}
            disable={cartItems.length === 0}
            onClick={onCheckout}
            />
        </div>
    );
};

export default Cart;