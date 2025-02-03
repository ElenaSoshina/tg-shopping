import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import './OrderPage.css';
import frozenCheese from '../../images/frozenCheese.webp';
import preparedCheese from '../../images/preparedCheese.webp';
import salmonSlice from '../../images/fish-5.webp';
import salmonPiece from '../../images/fish-2.webp';
import lemonImage from '../../images/lemonPage.webp';

import { calculateTotalPrice, getBackgroundImage } from '../../utils/utils';

import QuantityControls from './QuantityControls';
import OrderHeader from './OrderHeader';
import OrderImage from './OrderImage';
import OrderPopup from './OrderPopup';
import { Form, Input, Select, message } from 'antd';
import {applyThemeColors} from "../ui/theme";

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

    useEffect(() => {
        const savedOrder = JSON.parse(sessionStorage.getItem('currentOrder')) || [];
        setOrderItems(savedOrder);
    }, []);

    useEffect(() => {
        sessionStorage.setItem('currentOrder', JSON.stringify(orderItems));
    }, [orderItems]);

    const orderData = useMemo(() => {
        return (
            location.state?.orderData ||
            JSON.parse(sessionStorage.getItem('fishOrderData')) ||
            JSON.parse(sessionStorage.getItem('cheeseOrderData')) ||
            JSON.parse(sessionStorage.getItem('lemonOrderData')) ||
            {}
        );
    }, [location.state]);

    useEffect(() => {
        if (orderData?.quantity && orderData?.category) {
            let price = 40000; // Базовая цена
            let minQuantity = 1;

            if (orderData.type === 'cheese') {
                if (orderData.category === 'Сырники замороженные') {
                    price = 30000; // Новая цена для замороженных сырников
                    minQuantity = 10; // Минимальное количество для замороженных сырников
                } else {
                    minQuantity = 4; // Минимальное количество для приготовленных сырников
                }
            } else if (orderData.type === 'fish') {
                price = 160000;
            } else if (orderData.type === 'lemon') {
                price = 80000;
            }

            const newOrderItem = {
                id: 'order-item',
                title: orderData.type === 'fish' ? `Лосось ${orderData.category}` : orderData.category,
                quantity: Math.max(orderData.quantity, minQuantity), // Учитываем минимальное количество
                price,
                toppings: orderData.toppings || [],
            };

            setOrderItems((prevItems) => {
                const existingItemIndex = prevItems.findIndex(
                    (item) => item.id === newOrderItem.id
                );
                if (existingItemIndex !== -1) {
                    // Обновляем количество для существующего товара
                    const updatedItems = [...prevItems];
                    updatedItems[existingItemIndex].quantity += newOrderItem.quantity;
                    return updatedItems;
                }
                // Добавляем новый товар
                return [...prevItems, newOrderItem];
            });

        }
    }, [orderData]);

    useEffect(() => {
        applyThemeColors(); // Применяем тему при загрузке
        tg.onEvent('themeChanged', applyThemeColors);

        return () => {
            tg.offEvent('themeChanged', applyThemeColors);
        };
    }, []);

    const totalPrice = useMemo(() => calculateTotalPrice(orderItems), [orderItems]);

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

            console.log('Отправка данных заказа:', details);
            setOrderDetails(details);
            tg.sendData(JSON.stringify(details));
            setShowPopup(true);
            message.success('Заказ успешно оформлен!');
        },
        [pickupAddress, orderItems, totalPrice]
    );

    return (
        <>
            <div className="order-container">
                <OrderHeader redirectPath={`/${orderData.type || 'cheese'}`}/>
                <div className="order-content">
                    <OrderImage style={{
                        backgroundImage: `url(${getBackgroundImage(orderData.category, {
                            frozenCheese,
                            preparedCheese,
                            salmonSlice,
                            salmonPiece,
                            lemonImage
                        })})`
                    }}/>
                    <div className="order-details">
                        {orderItems.map((item, index) => (
                            <div key={item.id} className="order-item">
                                {/* Название товара */}
                                <h3>{item.title} {item.quantity}шт</h3>

                                {/* Отображение топпингов (если есть) */}
                                {item.toppings.length > 0 && (
                                    <p>
                                        <strong>Топпинги:</strong> {item.toppings.join(", ")}
                                    </p>
                                )}

                                {/* Количество с кнопками увеличения/уменьшения */}
                                <QuantityControls
                                    quantity={item.quantity}
                                    increase={() => {
                                        setOrderItems((prevItems) => {
                                            const newItems = [...prevItems];
                                            newItems[index].quantity += 1;
                                            return newItems;
                                        });
                                    }}
                                    decrease={() => {
                                        setOrderItems((prevItems) => {
                                            const newItems = [...prevItems];
                                            newItems[index].quantity = Math.max(1, newItems[index].quantity - 1);
                                            return newItems;
                                        });
                                    }}
                                />

                                {/* Цена за товар */}
                                <p><strong>Цена:</strong> {(item.price * item.quantity).toLocaleString()} VND</p>

                                {/* Разделитель между товарами */}
                                {index < orderItems.length - 1 && <hr/>}
                            </div>
                        ))}

                        {/* Итоговая стоимость */}
                        <h2>Итоговая стоимость заказа: {totalPrice.toLocaleString()} VND</h2>
                    </div>

                </div>
                {showPopup &&
                    <OrderPopup onClose={() => tg.close()} orderDetails={orderDetails} webAppQueryId={webAppQueryId}/>}
            </div>

            <h3 className={'add-order-header'}>Добавить в заказ</h3>
            <div className="order-buttons">
                <button
                    onClick={() => {
                        sessionStorage.setItem('currentOrder', JSON.stringify(orderItems));
                        navigate('/cheese')
                    }}
                >Сырники
                </button>
                <button onClick={() => {
                    sessionStorage.setItem('currentOrder', JSON.stringify(orderItems));
                    navigate('/fish')
                }}>Лосось
                </button>
                <button onClick={() => {
                    sessionStorage.setItem('currentOrder', JSON.stringify(orderItems));
                    navigate('/lemon')
                }}>Лимоны
                </button>
            </div>
            <div className="order-form">
                <h3>Данные для заказа</h3>
                <Form layout="vertical" form={form} onFinish={handleOrderSubmit}>
                    <Form.Item label="Имя" name="name" rules={[{required: true, message: 'Введите имя'}]}>
                        <Input placeholder="Введите ваше имя"/>
                    </Form.Item>
                    <Form.Item label="Телефон" name="phone" rules={[{
                        required: true,
                        pattern: /^\+?\d{10,15}$/,
                        message: 'Введите корректный номер'
                    }]}>
                        <Input placeholder="Введите номер телефона"/>
                    </Form.Item>
                    <Form.Item label="Способ получения" name="deliveryMethod" initialValue="pickup">
                        <Select>
                            <Option value="pickup">Самовывоз</Option>
                            <Option value="delivery">Доставка</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item shouldUpdate>
                        {({getFieldValue}) =>
                            getFieldValue('deliveryMethod') === 'delivery' ? (
                                <Form.Item label="Адрес доставки" name="address"
                                           rules={[{required: true, message: 'Введите адрес доставки'}]}>
                                    <Input placeholder="Введите адрес доставки"/>
                                </Form.Item>
                            ) : (
                                <p className="pickup-address">Самовывоз: {pickupAddress}</p>
                            )
                        }
                    </Form.Item>
                </Form>
            </div>
        </>
    );
}

export default OrderPage;