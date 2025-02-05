import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './OrderPage.css';
import { Form, Input, Select, message } from 'antd';
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
            location.state?.orderData || // Используем данные из state, если есть
            (location.pathname === '/order' && JSON.parse(sessionStorage.getItem('fishOrderData'))) || // Только для FishPage
            (location.pathname === '/order' && JSON.parse(sessionStorage.getItem('cheeseOrderData'))) || // Только для CheesePage
            (location.pathname === '/order' && JSON.parse(sessionStorage.getItem('lemonOrderData'))) || // Только для LemonPage
            {}
        );
    }, [location.state, location.pathname]);

    // Обновление заказа при добавлении нового товара
    useEffect(() => {
        if (orderData?.quantity && orderData?.category) {
            const newOrderItem = {
                id: `${orderData.type}-${orderData.category}`,
                title: orderData.category, // Убираем "Лосось" перед названием
                quantity: orderData.quantity,
                price: orderData.price,
                image: orderData.image,
                toppings: orderData.toppings || [],
                type: orderData.type,
            };

            setOrderItems((prevItems) => {
                const existingItemIndex = prevItems.findIndex((item) => item.id === newOrderItem.id);
                if (existingItemIndex !== -1) {
                    const updatedItems = [...prevItems];
                    updatedItems[existingItemIndex] = { ...newOrderItem }; // Полное обновление данных
                    return updatedItems;
                }
                return [...prevItems, newOrderItem]; // Добавление нового товара
            });
        }
    }, [orderData]);

    const totalPrice = useMemo(() => {
        return orderItems.reduce((sum, item) => {
            const itemPrice = Number(item.price);
            return sum + (isNaN(itemPrice) ? 0 : itemPrice);
        }, 0);
    }, [orderItems]);

    useEffect(() => {
        const checkFormValidity = async () => {
            try {
                await form.validateFields();
                tg.MainButton.setText('Перейти к заказу');
                tg.MainButton.show();
            } catch {
                tg.MainButton.hide();
            }
        };

        checkFormValidity();

        return () => {
            tg.MainButton.hide();
        };
    }, [form]);

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
                <div className="order-details">
                    {orderItems.map((item, index) => (
                        <div key={item.id} className="order-item">
                            <img src={item.image || '../../images/fish.webp'} alt={item.title}
                                 className="order-item-image"/>
                            <div className="order-item-info">
                                <h3>
                                    {item.title}
                                </h3>

                                <p>Количество: {item.quantity}{unitMapping[item.type]}</p>
                                {item.toppings.length > 0 && (
                                    <p>Топпинги: {item.toppings.map((topping) => toppingsMapping[topping] || topping).join(', ')}</p>
                                )}
                                <p>Цена: {item.price && !isNaN(item.price) ? Number(item.price).toLocaleString('ru-RU') : '0'} VND</p>
                                {index < orderItems.length - 1 && <hr/>}
                                <div className="order-item-actions">
                                    <button
                                        className="edit-button"
                                        onClick={() => {
                                            // Сохраняем выбранный товар и возвращаемся на его страницу
                                            sessionStorage.setItem(`${item.type}OrderData`, JSON.stringify(item));
                                            navigate(`/${item.type}`);
                                        }}
                                    >
                                        Изменить
                                    </button>
                                    <button
                                        className="delete-button"
                                        onClick={() => {
                                            // Удаляем товар из списка заказов
                                            setOrderItems((prevItems) => prevItems.filter((_, i) => i !== index));
                                        }}
                                    >
                                        Удалить
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    <h2>Итоговая стоимость: {totalPrice > 0 ? totalPrice.toLocaleString('ru-RU') : '0'} VND</h2>

                </div>

                {showPopup && (
                    <OrderPopup onClose={() => tg.close()} orderDetails={orderDetails} webAppQueryId={webAppQueryId}/>
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
                <Form
                    layout="vertical"
                    form={form}
                    onFinish={handleOrderSubmit}
                    onValuesChange={() => form.validateFields()
                        .then(() => tg.MainButton.show())
                        .catch(() => tg.MainButton.hide())}
                >
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
                                    rules={[{ message: 'Введите адрес доставки' }]}
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
