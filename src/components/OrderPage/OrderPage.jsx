import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './OrderPage.css';
import { Form, Input, Select, message } from 'antd';
import OrderPopup from './OrderPopup';
import { debounce } from 'lodash';

const { Option } = Select;
const tg = window.Telegram.WebApp;

function OrderPage({ webAppQueryId }) {
    const [form] = Form.useForm();
    const [showPopup, setShowPopup] = useState(false);
    const [orderItems, setOrderItems] = useState([]);
    const [orderDetails, setOrderDetails] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    // Если у вас всегда одна и та же точка самовывоза
    const pickupAddress = 'Mui ne, Ocean vista, block B';

    // Маппинг единиц измерения (используем только для отображения)
    const unitMapping = useMemo(
        () => ({
            cheese: 'шт',
            fish: 'г',
            lemon: 'уп',
        }),
        []
    );

    // Маппинг топпингов
    const toppingsMapping = useMemo(
        () => ({
            sourCream: 'Йогурт',
            condensedMilk: 'Сгущенка',
            passionFruitJam: 'Джем из маракуйи',
        }),
        []
    );

    // Восстанавливаем заказ из sessionStorage (если он был)
    useEffect(() => {
        const savedOrder = JSON.parse(sessionStorage.getItem('currentOrder')) || [];
        setOrderItems(savedOrder);
    }, []);

    // И сохраняем заказ при каждом изменении
    useEffect(() => {
        sessionStorage.setItem('currentOrder', JSON.stringify(orderItems));
    }, [orderItems]);

    // Смотрим, не пришли ли данные о новом товаре (например, с другой страницы)
    const orderData = React.useMemo(() => {
        return (
            location.state?.orderData ||
            (location.pathname === '/order' && JSON.parse(sessionStorage.getItem('fishOrderData'))) ||
            (location.pathname === '/order' && JSON.parse(sessionStorage.getItem('cheeseOrderData'))) ||
            (location.pathname === '/order' && JSON.parse(sessionStorage.getItem('lemonOrderData'))) ||
            {}
        );
    }, [location.state, location.pathname]);

    // Если пришёл новый товар, добавляем/обновляем его в заказ
    useEffect(() => {
        if (orderData?.quantity && orderData?.category) {
            const newOrderItem = {
                id: `${orderData.type}-${orderData.category}`,
                title: orderData.category,
                quantity: orderData.quantity,
                price: orderData.price,  // <== ВАЖНО: price уже полный?
                image: orderData.image,
                toppings: orderData.toppings || [],
                type: orderData.type,
            };

            setOrderItems((prevItems) => {
                const existingItemIndex = prevItems.findIndex((item) => item.id === newOrderItem.id);
                if (existingItemIndex !== -1) {
                    const updatedItems = [...prevItems];
                    updatedItems[existingItemIndex] = { ...newOrderItem };
                    return updatedItems;
                }
                return [...prevItems, newOrderItem];
            });
        }
    }, [orderData]);

    // Если price у нас уже "за всю позицию", то totalPrice = сумма всех price
    const totalPrice = React.useMemo(() => {
        return orderItems.reduce((sum, item) => {
            // item.price — это уже конечная сумма за весь товар
            const itemPrice = Number(item.price);
            return sum + (isNaN(itemPrice) ? 0 : itemPrice);
        }, 0);
    }, [orderItems]);

    // Дебаунс-функция для валидации формы и показа кнопки Telegram
    const validateAndShowButton = React.useMemo(
        () =>
            debounce(() => {
                form
                    .validateFields()
                    .then(() => {
                        tg.MainButton.setText('Оформить заказ');
                        tg.MainButton.show();
                    })
                    .catch(() => {
                        tg.MainButton.hide();
                    });
            }, 300),
        [form]
    );

    useEffect(() => {
        form.setFieldsValue({
            name: '',
            phone: '',
            deliveryMethod: undefined,
        });

        validateAndShowButton();

        return () => {
            tg.MainButton.hide();
        };
    }, [form, validateAndShowButton]);

    // При нажатии на кнопку "Оформить заказ" в Telegram
    useEffect(() => {
        const handleMainButtonClick = () => {
            form.submit(); // вызовет onFinish
        };

        tg.MainButton.onClick(handleMainButtonClick);
        return () => {
            tg.MainButton.offClick(handleMainButtonClick);
        };
    }, [form]);

    async function handleOrderSubmit(values) {
        // Формируем данные для отправки боту
        const details = {
            ...values,
            address: values.deliveryMethod === 'delivery' ? values.address : pickupAddress,
            items: orderItems.map((item) => ({
                ...item,
                // Если price — уже вся сумма за эту позицию, просто кладём в total
                total: Number(item.price).toFixed(2),
            })),
            // Общая сумма
            totalPrice: totalPrice.toFixed(2),
        };

        try {
            tg.sendData(JSON.stringify(details));

            // Формируем сообщение для WebApp
            const itemsList = details.items
                .map((item) => {
                    // Форматируем total
                    const itemTotal = Number(item.total).toLocaleString('ru-RU', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    });
                    return `${item.title} — ${item.quantity} ${unitMapping[item.type]} — ${itemTotal} VND${
                        item.toppings.length
                            ? ' (Топпинги: ' +
                            item.toppings.map((t) => toppingsMapping[t] || t).join(', ') +
                            ')'
                            : ''
                    }`;
                })
                .join('\n');

            const msg = `🛒 *Ваш заказ:*\n\n${itemsList}\n\n💳 *Итого:* ${details.totalPrice} VND\n\n📍 *Способ получения:* ${
                details.deliveryMethod === 'delivery'
                    ? 'Доставка на адрес: ' + details.address
                    : 'Самовывоз'
            }`;

            tg.showAlert('Спасибо за ваш заказ! Данные отправлены.');
            console.log('[DEBUG] Message sent to user:', msg);

            // Закрываем WebApp
            tg.close();

            setOrderDetails(details);
            setShowPopup(true);
            message.success('Заказ успешно оформлен и отправлен пользователю!');
        } catch (error) {
            console.error('[ERROR] Sending order details:', error);
            message.error('Произошла ошибка при отправке заказа пользователю.');
        }
    }

    return (
        <>
            <div className="order-container">
                <div className="order-details">
                    {orderItems.map((item, index) => {
                        const title = item.title.includes('Нарезка') ? `Лосось ${item.title}` : item.title;
                        // Цена (item.price) = уже общая сумма за позицию
                        const priceStr = Number(item.price).toLocaleString('ru-RU');
                        return (
                            <div key={item.id} className="order-item">
                                <img
                                    src={item.image || '../../images/fish.webp'}
                                    alt={item.title}
                                    className="order-item-image"
                                />
                                <div className="order-item-info">
                                    <h3>{title}</h3>
                                    <p>
                                        Количество: {item.quantity}
                                        {unitMapping[item.type]}
                                    </p>
                                    {item.toppings.length > 0 && (
                                        <p>
                                            Топпинги:{' '}
                                            {item.toppings
                                                .map((t) => toppingsMapping[t] || t)
                                                .join(', ')}
                                        </p>
                                    )}
                                    <p>Цена: {priceStr} VND</p>
                                    {index < orderItems.length - 1 && <hr />}
                                    <div className="order-item-actions">
                                        <button
                                            className="edit-button"
                                            onClick={() => {
                                                sessionStorage.setItem(
                                                    `${item.type}OrderData`,
                                                    JSON.stringify(item)
                                                );
                                                navigate(`/${item.type}`);
                                            }}
                                        >
                                            Изменить
                                        </button>
                                        <button
                                            className="delete-button"
                                            onClick={() => {
                                                setOrderItems((prevItems) =>
                                                    prevItems.filter((_, i) => i !== index)
                                                );
                                            }}
                                        >
                                            Удалить
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    <h2>
                        Итоговая стоимость:{' '}
                        {totalPrice > 0 ? totalPrice.toLocaleString('ru-RU') : '0'} VND
                    </h2>
                </div>

                {showPopup && (
                    <OrderPopup
                        onClose={() => tg.close()}
                        orderDetails={orderDetails}
                        webAppQueryId={webAppQueryId}
                    />
                )}
            </div>

            <h3 className="add-order-header">Добавить в заказ</h3>
            <div className="order-buttons">
                <button onClick={() => navigate('/cheese')}>Сырники</button>
                <button onClick={() => navigate('/fish')}>Лосось</button>
                <button onClick={() => navigate('/lemon')}>Лимоны</button>
            </div>

            {/* Форма (без кнопки submit, используем MainButton Telegram) */}
            <div className="order-form">
                <h3>Данные для заказа</h3>
                <Form
                    layout="vertical"
                    form={form}
                    onFinish={handleOrderSubmit}
                    onValuesChange={validateAndShowButton}
                    initialValues={{
                        name: '',
                        phone: '',
                        deliveryMethod: undefined,
                    }}
                >
                    <Form.Item
                        label={<span className="form-label">Имя</span>}
                        name="name"
                        rules={[{ required: true, message: 'Введите имя' }]}
                    >
                        <Input placeholder="Введите ваше имя" />
                    </Form.Item>
                    <Form.Item
                        label={<span className="form-label">Телефон</span>}
                        name="phone"
                        rules={[
                            {
                                required: true,
                                pattern: /^\+?\d{10,15}$/,
                                message: 'Введите корректный номер телефона',
                            },
                        ]}
                    >
                        <Input
                            placeholder="Введите номер телефона"
                            inputMode="numeric"
                            pattern="[0-9]*"
                        />
                    </Form.Item>
                    <Form.Item
                        label={<span className="form-label">Способ получения</span>}
                        name="deliveryMethod"
                        rules={[{ required: true, message: 'Выберите способ получения' }]}
                    >
                        <Select placeholder="Выберите способ получения" allowClear>
                            <Option value="pickup">Самовывоз</Option>
                            <Option value="delivery">Доставка</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        shouldUpdate={(prevValues, currentValues) =>
                            prevValues.deliveryMethod !== currentValues.deliveryMethod
                        }
                    >
                        {({ getFieldValue }) => {
                            const deliveryMethod = getFieldValue('deliveryMethod');
                            if (deliveryMethod === 'delivery') {
                                return (
                                    <Form.Item
                                        label={<span className="form-label">Адрес доставки</span>}
                                        name="address"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Введите адрес доставки',
                                            },
                                        ]}
                                    >
                                        <Input placeholder="Введите адрес доставки" />
                                    </Form.Item>
                                );
                            } else if (deliveryMethod === 'pickup') {
                                return (
                                    <p className="pickup-address">
                                        Самовывоз: {pickupAddress}
                                    </p>
                                );
                            }
                            return null;
                        }}
                    </Form.Item>
                </Form>
            </div>
        </>
    );
}

export default OrderPage;
