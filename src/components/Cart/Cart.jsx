import React from 'react';
import './Cart.css'


const Cart = ({cartItems, onCheckout}) => {

    const totalPrice = cartItems.reduce((a, c) => a + c.price * c.quantity, 0)

    return (
        <div className={'cart__container'}>
            {cartItems.length === 0 ? (
                <p>No items in cart</p>
            ) : (
                <>
                 <span>Total price: ${totalPrice.toFixed(2)}</span>
                </>
            )}
        </div>
    );
};

export default Cart;