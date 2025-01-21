import React from 'react';

function OrderPage({ cartItems }) {
    return (
        <div>
            <h2>Your Order</h2>
            {cartItems.length === 0 ? (
                <p>Your cart is empty</p>
            ) : (
                <ul>
                    {cartItems.map(item => (
                        <li key={item.id}>
                            {item.name} - Quantity: {item.quantity}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default OrderPage;
