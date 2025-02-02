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
import OrderSummary from './OrderSummary';
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
            setOrderItems([newOrderItem]);
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
                        <QuantityControls quantity={orderItems[0]?.quantity || 1} increase={() => {
                        }} decrease={() => {
                        }}/>
                        <OrderSummary orderItems={orderItems} totalPrice={totalPrice} type={orderData.type}/>
                    </div>
                </div>
                {showPopup &&
                    <OrderPopup onClose={() => tg.close()} orderDetails={orderDetails} webAppQueryId={webAppQueryId}/>}
            </div>

            <h3 className={'add-order-header'}>Добавить в заказ</h3>
            <div className="order-buttons">
                <button onClick={() => navigate('/cheese')}>Сырники</button>
                <button onClick={() => navigate('/fish')}>Лосось</button>
                <button onClick={() => navigate('/lemon')}>Лимоны</button>
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