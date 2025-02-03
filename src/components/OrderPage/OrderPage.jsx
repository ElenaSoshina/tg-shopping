import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './OrderPage.css';
import { Form, Input, Select, message } from 'antd';
import OrderHeader from './OrderHeader';
import OrderPopup from './OrderPopup';

const { Option } = Select;
const tg = window.Telegram.WebApp;

function OrderPage({ webAppQueryId }) {
    const [form] = Form.useForm();
    const [showPopup, setShowPopup] = useState(false);
    const [orderItems, setOrderItems] = useState([]);
    const [orderDetails, setOrderDetails] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    const pickupAddress = 'Mui ne, Ocean vista, block B';

    // Маппинг единиц измерения
    const unitMapping = {
        cheese: 'шт',
        fish: 'г',
        lemon: 'уп',
    };

    // Маппинг топпингов
    const toppingsMapping = {
        sourCream: 'Йогурт',
        condensedMilk: 'Сгущенка',
        passionFruitJam: 'Джем из маракуйи',
    };

    // Восстановление заказа из sessionStorage
    useEffect(() => {
        const savedOrder = JSON.parse(sessionStorage.getItem('currentOrder')) || [];
        setOrderItems(savedOrder);
    }, []);

    // Сохранение заказа в sessionStorage при изменении
    useEffect(() => {
        sessionStorage.setItem('currentOrder', JSON.stringify(orderItems));
    }, [orderItems]);

    // Получение данных нового товара из location или sessionStorage
    const orderData = useMemo(() => {
        return (
            location.state?.orderData ||
            JSON.parse(sessionStorage.getItem('fishOrderData')) ||
            JSON.parse(sessionStorage.getItem('cheeseOrderData')) ||
            JSON.parse(sessionStorage.getItem('lemonOrderData')) ||
            {}
        );
    }, [location.state]);

    // Обновление заказа при добавлении нового товара
    useEffect(() => {
        if (orderData?.quantity && orderData?.category) {
            const newOrderItem = {
                id: `${orderData.type}-${orderData.category}`,
                title: orderData.category,
                quantity: orderData.quantity,
                price: orderData.type === 'cheese' ? 30000 : orderData.type === 'fish' ? 160 : 80000, // Цена за единицу
                image: orderData.type === 'cheese' ? '/path/to/cheese.jpg' : orderData.type === 'fish' ? '/path/to/fish.jpg' : '/path/to/lemon.jpg',
                toppings: orderData.toppings || [],
                type: orderData.type,
            };

            setOrderItems((prevItems) => {
                const existingItemIndex = prevItems.findIndex((item) => item.id === newOrderItem.id);
                if (existingItemIndex !== -1) {
                    const updatedItems = [...prevItems];
                    updatedItems[existingItemIndex].quantity += newOrderItem.quantity;
                    return updatedItems;
                }
                return [...prevItems, newOrderItem];
            });
        }
    }, [orderData]);

    const totalPrice = useMemo(() => {
        return orderItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
    }, [orderItems]);

    const handleOrderSubmit = useCallback(
        (values) => {
            const details = {
                ...values,
                address: values.deliveryMethod === 'delivery' ? values.address : pickupAddress,
                items: orderItems.map((item) => ({
                    ...item,
                    total: (item.price * item.quantity).toFixed(2),
                })),
                totalPrice: totalPrice.toFixed(2),
            };

            tg.sendData(JSON.stringify(details));
            setOrderDetails(details);
            setShowPopup(true);
            message.success('Заказ успешно оформлен!');
        },
        [pickupAddress, orderItems, totalPrice]
    );

    return (
        <>
            <div className="order-container">
                <OrderHeader redirectPath="/menu" />
                <div className="order-details">
                    {orderItems.map((item, index) => (
                        <div key={item.id} className="order-item">
                            <img src={item.image} alt={item.title} className="order-item-image" />
                            <h3>{item.title}</h3>
                            <p>Количество: {item.quantity}{unitMapping[item.type]}</p>
                            {item.toppings.length > 0 && (
                                <p>Топпинги: {item.toppings.map((topping) => toppingsMapping[topping]).join(', ')}</p>
                            )}
                            <p>Цена: {(item.price * item.quantity).toLocaleString('ru-RU')} VND</p>
                            {index < orderItems.length - 1 && <hr />}
                        </div>
                    ))}
                    <h2>Итоговая стоимость: {totalPrice.toLocaleString('ru-RU')} VND</h2>
                </div>

                {showPopup && (
                    <OrderPopup onClose={() => tg.close()} orderDetails={orderDetails} webAppQueryId={webAppQueryId} />
                )}
            </div>

            <h3 className="add-order-header">Добавить в заказ</h3>
            <div className="order-buttons">
                <button onClick={() => navigate('/cheese')}>Сырники</button>
                <button onClick={() => navigate('/fish')}>Лосось</button>
                <button onClick={() => navigate('/lemon')}>Лимоны</button>
            </div>

            <div className="order-form">
                <h3>Данные для заказа</h3>
                <Form layout="vertical" form={form} onFinish={handleOrderSubmit}>
                    <Form.Item label="Имя" name="name" rules={[{ required: true, message: 'Введите имя' }]}>
                        <Input placeholder="Введите ваше имя" />
                    </Form.Item>
                    <Form.Item
                        label="Телефон"
                        name="phone"
                        rules={[
                            { required: true, pattern: /^\+?\d{10,15}$/, message: 'Введите корректный номер телефона' },
                        ]}
                    >
                        <Input placeholder="Введите номер телефона" />
                    </Form.Item>
                    <Form.Item label="Способ получения" name="deliveryMethod" initialValue="pickup">
                        <Select>
                            <Option value="pickup">Самовывоз</Option>
                            <Option value="delivery">Доставка</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item shouldUpdate>
                        {({ getFieldValue }) => {
                            const deliveryMethod = getFieldValue('deliveryMethod') || 'pickup';
                            return deliveryMethod === 'delivery' ? (
                                <Form.Item
                                    label="Адрес доставки"
                                    name="address"
                                    rules={[{ required: true, message: 'Введите адрес доставки' }]}
                                >
                                    <Input placeholder="Введите адрес доставки" />
                                </Form.Item>
                            ) : (
                                <p className="pickup-address">Самовывоз: {pickupAddress}</p>
                            );
                        }}
                    </Form.Item>
                </Form>
            </div>
        </>
    );
}

export default OrderPage;
