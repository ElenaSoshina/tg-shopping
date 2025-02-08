// import React, { useState, useEffect, useMemo } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import './OrderPage.css';
// import { Form, Input, Select, message } from 'antd';
// import OrderPopup from './OrderPopup';
// import { debounce } from 'lodash';
//
// const { Option } = Select;
// const tg = window.Telegram.WebApp;
//
// function OrderPage({ webAppQueryId }) {
//     const [form] = Form.useForm();
//     const [showPopup, setShowPopup] = useState(false);
//     const [orderItems, setOrderItems] = useState([]);
//     const [orderDetails, setOrderDetails] = useState(null);
//     const location = useLocation();
//     const navigate = useNavigate();
//     const pickupAddress = 'Mui ne, Ocean vista, block B';
//
//     // Маппинг единиц измерения
//     const unitMapping = useMemo(() => ({
//         cheese: 'шт',
//         fish: 'г',
//         lemon: 'уп',
//     }), []);
//
//     // Используем useMemo для маппинга топпингов
//     const toppingsMapping = useMemo(() => ({
//         sourCream: 'Йогурт',
//         condensedMilk: 'Сгущенка',
//         passionFruitJam: 'Джем из маракуйи',
//     }), []);
//
//     // Восстановление заказа из sessionStorage
//     useEffect(() => {
//         const savedOrder = JSON.parse(sessionStorage.getItem('currentOrder')) || [];
//         setOrderItems(savedOrder);
//     }, []);
//
//     // Сохранение заказа в sessionStorage при изменении
//     useEffect(() => {
//         sessionStorage.setItem('currentOrder', JSON.stringify(orderItems));
//     }, [orderItems]);
//
//     // Получение данных нового товара из location или sessionStorage
//     const orderData = useMemo(() => {
//         return (
//             location.state?.orderData || // Используем данные из state, если есть
//             (location.pathname === '/order' && JSON.parse(sessionStorage.getItem('fishOrderData'))) || // Только для FishPage
//             (location.pathname === '/order' && JSON.parse(sessionStorage.getItem('cheeseOrderData'))) || // Только для CheesePage
//             (location.pathname === '/order' && JSON.parse(sessionStorage.getItem('lemonOrderData'))) || // Только для LemonPage
//             {}
//         );
//     }, [location.state, location.pathname]);
//
//     // Обновление заказа при добавлении нового товара
//     useEffect(() => {
//         if (orderData?.quantity && orderData?.category) {
//             const newOrderItem = {
//                 id: `${orderData.type}-${orderData.category}`,
//                 title: orderData.category,
//                 quantity: orderData.quantity,
//                 price: orderData.price,
//                 image: orderData.image,
//                 toppings: orderData.toppings || [],
//                 type: orderData.type,
//             };
//
//             setOrderItems((prevItems) => {
//                 const existingItemIndex = prevItems.findIndex((item) => item.id === newOrderItem.id);
//                 if (existingItemIndex !== -1) {
//                     const updatedItems = [...prevItems];
//                     updatedItems[existingItemIndex] = { ...newOrderItem };
//                     return updatedItems;
//                 }
//                 return [...prevItems, newOrderItem];
//             });
//         }
//     }, [orderData]);
//
//     const totalPrice = useMemo(() => {
//         return orderItems.reduce((sum, item) => {
//             const itemPrice = Number(item.price);
//             return sum + (isNaN(itemPrice) ? 0 : itemPrice);
//         }, 0);
//     }, [orderItems]);
//
//     // Проверка валидации формы и управление кнопкой MainButton
//     const validateAndShowButton = useMemo(
//         () =>
//         debounce(() => {
//             form.validateFields()
//                 .then(() => {
//                     tg.MainButton.setText('Оформить заказ');
//                     tg.MainButton.show();
//                 })
//                 .catch(() => {
//                     tg.MainButton.hide();
//                 });
//         }, 300),
//         [form]
//     );
//
//     useEffect(() => {
//         // Инициализация начальных значений формы
//         form.setFieldsValue({
//             name: '',
//             phone: '',
//             deliveryMethod: undefined,
//         });
//
//         // Первичная проверка валидации
//         validateAndShowButton();
//
//         return () => {
//             tg.MainButton.hide();
//         };
//     }, [form, validateAndShowButton]);
//
//     useEffect(() => {
//         const handleMainButtonClick = () => {
//             console.log('[DEBUG] Нажата кнопка "Оформить заказ"');
//             form.submit(); // Вызовет onFinish формы
//         };
//
//         tg.MainButton.onClick(handleMainButtonClick);
//
//         // Отключаем обработчик при размонтировании
//         return () => {
//             tg.MainButton.offClick(handleMainButtonClick);
//         };
//     }, [form]);
//
//     async function handleOrderSubmit(values) {
//         const details = {
//             ...values,
//             address: values.deliveryMethod === 'delivery' ? values.address : pickupAddress,
//             items: orderItems.map((item) => ({
//                 ...item,
//                 total: (item.price * item.quantity).toFixed(2),
//             })),
//             totalPrice: totalPrice.toFixed(2),
//         };
//
//         alert("[DEBUG] Отправляемые данные:\n" + JSON.stringify(details, null, 2));
//
//
//         try {
//             // Отправляем данные боту
//             tg.sendData(JSON.stringify(details));
//
//             // Формируем сообщение для пользователя
//             const itemsList = details.items
//                 .map((item) => (
//                     `${item.title} — ${item.quantity} ${unitMapping[item.type]} — ${item.total} VND`
//                 ))
//                 .join('\n');
//
//             const messageText = `🛒 *Ваш заказ:*\n\n${itemsList}\n\n💳 *Итого:* ${details.totalPrice} VND\n\n📍 *Способ получения:* ${
//                 details.deliveryMethod === 'delivery'
//                     ? 'Доставка на адрес: ' + details.address
//                     : 'Самовывоз'
//             }`;
//
//             console.log('[DEBUG] Message sent to user:', messageText);
//
//             // Закрытие WebApp
//             tg.close();
//
//             setOrderDetails(details);
//             setShowPopup(true);
//             message.success('Заказ успешно оформлен и отправлен пользователю!');
//         } catch (error) {
//             console.error('[ERROR] Sending order details:', error);
//             message.error('Произошла ошибка при отправке заказа пользователю.');
//         }
//     }
//
//     return (
//         <>
//             <div className="order-container">
//                 <div className="order-details">
//                     {orderItems.map((item, index) => {
//                         const displayTitle = item.type === 'fish' ? `Лосось ${item.title}` : item.title;
//
//                         return (
//                             <div key={item.id} className="order-item">
//                                 <img src={item.image || '../../images/fish.webp'} alt={item.title}
//                                      className="order-item-image"/>
//                                 <div className="order-item-info">
//                                     <h3>{displayTitle}</h3>
//                                     <p>Количество: {item.quantity}{unitMapping[item.type]}</p>
//                                     {item.toppings.length > 0 && (
//                                         <p>Топпинги: {item.toppings.map((topping) => toppingsMapping[topping] || topping).join(', ')}</p>
//                                     )}
//                                     <p>Цена: {item.price && !isNaN(item.price) ? Number(item.price).toLocaleString('ru-RU') : '0'} VND</p>
//                                     {index < orderItems.length - 1 && <hr/>}
//                                     <div className="order-item-actions">
//                                         <button
//                                             className="edit-button"
//                                             onClick={() => {
//                                                 sessionStorage.setItem(`${item.type}OrderData`, JSON.stringify(item));
//                                                 navigate(`/${item.type}`);
//                                             }}
//                                         >
//                                             Изменить
//                                         </button>
//                                         <button
//                                             className="delete-button"
//                                             onClick={() => {
//                                                 setOrderItems((prevItems) => prevItems.filter((_, i) => i !== index));
//                                             }}
//                                         >
//                                             Удалить
//                                         </button>
//                                     </div>
//                                 </div>
//                             </div>
//                         )
//                         }
//                     )}
//                     <h2>Итоговая стоимость: {totalPrice > 0 ? totalPrice.toLocaleString('ru-RU') : '0'} VND</h2>
//                 </div>
//
//
//                 {showPopup && (
//                     <OrderPopup onClose={() => tg.close()} orderDetails={orderDetails} webAppQueryId={webAppQueryId}/>
//                 )}
//             </div>
//
//             <h3 className="add-order-header">Добавить в заказ</h3>
//             <div className="order-buttons">
//                 <button onClick={() => navigate('/cheese')}>Сырники</button>
//                 <button onClick={() => navigate('/fish')}>Лосось</button>
//                 <button onClick={() => navigate('/lemon')}>Лимоны</button>
//             </div>
//
//             <div className="order-form">
//                 <h3>Данные для заказа</h3>
//                 <Form
//                     layout="vertical"
//                     form={form}
//                     onFinish={handleOrderSubmit}
//                     onValuesChange={validateAndShowButton}
//                     initialValues={{
//                         name: '',
//                         phone: '',
//                         deliveryMethod: undefined,
//                     }}
//                 >
//                     <Form.Item label="Имя" name="name" rules={[{required: true, message: 'Введите имя'}]}>
//                         <Input placeholder="Введите ваше имя"/>
//                     </Form.Item>
//                     <Form.Item
//                         label="Телефон"
//                         name="phone"
//                         rules={[
//                             {required: true, pattern: /^\+?\d{10,15}$/, message: 'Введите корректный номер телефона'},
//                         ]}
//                     >
//                         <Input placeholder="Введите номер телефона"
//                                inputMode="numeric"
//                                pattern={"[0-9]*"}
//                         />
//                     </Form.Item>
//                     <Form.Item
//                         label="Способ получения"
//                         name="deliveryMethod"
//                         rules={[{ required: true, message: 'Выберите способ получения' }]}
//                     >
//                         <Select placeholder="Выберите способ получения" allowClear>
//                             <Option value="pickup">Самовывоз</Option>
//                             <Option value="delivery">Доставка</Option>
//                         </Select>
//                     </Form.Item>
//
//                     <Form.Item shouldUpdate={(prevValues, currentValues) => prevValues.deliveryMethod !== currentValues.deliveryMethod}>
//                         {({ getFieldValue }) => {
//                             const deliveryMethod = getFieldValue('deliveryMethod');
//                             return deliveryMethod === 'delivery' ? (
//                                 <Form.Item
//                                     label="Адрес доставки"
//                                     name="address"
//                                     rules={[{ required: true, message: 'Введите адрес доставки' }]}
//                                 >
//                                     <Input placeholder="Введите адрес доставки" />
//                                 </Form.Item>
//                             ) : deliveryMethod === 'pickup' ? (
//                                 <p className="pickup-address">Самовывоз: {pickupAddress}</p>
//                             ) : null;
//                         }}
//                     </Form.Item>
//                 </Form>
//             </div>
//         </>
//     );
// }
//
// export default OrderPage;


import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './OrderPage.css';
import { Form, Input, Select } from 'antd';
import { debounce } from 'lodash';

const { Option } = Select;
const tg = window.Telegram.WebApp;

function OrderPage() {
    const [form] = Form.useForm();
    const [orderItems, setOrderItems] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();
    const pickupAddress = 'Mui ne, Ocean vista, block B';

    const unitMapping = useMemo(() => ({
        cheese: 'шт',
        fish: 'г',
        lemon: 'уп',
    }), []);

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
            const newOrderItem = {
                id: `${orderData.type}-${orderData.category}`,
                title: orderData.category,
                quantity: orderData.quantity,
                price: orderData.price,
                image: orderData.image,
                type: orderData.type,
            };

            setOrderItems((prevItems) => {
                const existingIndex = prevItems.findIndex((item) => item.id === newOrderItem.id);
                if (existingIndex !== -1) {
                    const updatedItems = [...prevItems];
                    updatedItems[existingIndex] = { ...newOrderItem };
                    return updatedItems;
                }
                return [...prevItems, newOrderItem];
            });
        }
    }, [orderData]);

    const totalPrice = useMemo(() => {
        return orderItems.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
    }, [orderItems]);

    const validateAndShowButton = useMemo(() =>
            debounce(() => {
                form.validateFields()
                    .then(() => {
                        tg.MainButton.setText('Оформить заказ');
                        tg.MainButton.show();
                    })
                    .catch(() => {
                        tg.MainButton.hide();
                    });
            }, 300),
        [form]);

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

    useEffect(() => {
        const handleMainButtonClick = () => {
            form.submit();
        };

        tg.MainButton.onClick(handleMainButtonClick);

        return () => {
            tg.MainButton.offClick(handleMainButtonClick);
        };
    }, [form]);

    async function handleOrderSubmit(values) {
        const details = {
            ...values,
            address: values.deliveryMethod === 'delivery' ? values.address : pickupAddress,
            items: orderItems.map((item) => ({
                ...item,
                total: (item.price * item.quantity).toFixed(2),
            })),
            totalPrice: totalPrice.toFixed(2),
        };

        alert(`[DEBUG] Отправляемые данные:\n${JSON.stringify(details, null, 2)}`);

        const queryId = tg.initDataUnsafe?.query_id;

        if (queryId) {
            try {
                const payload = {
                    type: 'article',
                    id: 'order_summary',
                    title: 'Ваш заказ успешно оформлен!',
                    input_message_content: {
                        message_text: `🛒 Ваш заказ:\n\n${details.items.map((item) =>
                            `${item.title} — ${item.quantity} ${unitMapping[item.type]} — ${item.total} VND`
                        ).join('\n')}\n\n💳 Итого: ${details.totalPrice} VND`,
                        parse_mode: 'HTML',
                    },
                };

                // Проверьте доступность метода
                if (tg.answerWebAppQuery) {
                    await tg.answerWebAppQuery(queryId, payload);
                    alert('[DEBUG] Заказ успешно отправлен через answerWebAppQuery');
                } else {
                    throw new Error('Метод answerWebAppQuery недоступен');
                }
            } catch (error) {
                alert(`[ERROR] Ошибка при отправке через answerWebAppQuery: ${error.message}`);
            }
        } else {
            alert('[ERROR] query_id отсутствует!');
        }
    }


    return (
        <>
            <div className="order-container">
                <div className="order-details">
                    {orderItems.map((item, index) => (
                        <div key={item.id} className="order-item">
                            <img src={item.image || '../../images/fish.webp'} alt={item.title} className="order-item-image" />
                            <div className="order-item-info">
                                <h3>{item.type === 'fish' ? `Лосось ${item.title}` : item.title}</h3>
                                <p>Количество: {item.quantity}{unitMapping[item.type]}</p>
                                <p>Цена: {item.price?.toLocaleString('ru-RU')} VND</p>
                                {index < orderItems.length - 1 && <hr />}
                            </div>
                        </div>
                    ))}
                    <h2>Итоговая стоимость: {totalPrice.toLocaleString('ru-RU')} VND</h2>
                </div>

                <h3 className="add-order-header">Добавить в заказ</h3>
                <div className="order-buttons">
                    <button onClick={() => navigate('/cheese')}>Сырники</button>
                    <button onClick={() => navigate('/fish')}>Лосось</button>
                    <button onClick={() => navigate('/lemon')}>Лимоны</button>
                </div>

                <Form
                    layout="vertical"
                    form={form}
                    onFinish={handleOrderSubmit}
                    onValuesChange={validateAndShowButton}
                >
                    <Form.Item label="Имя" name="name" rules={[{ required: true, message: 'Введите имя' }]}>
                        <Input placeholder="Введите ваше имя" />
                    </Form.Item>
                    <Form.Item label="Телефон" name="phone" rules={[{ required: true, message: 'Введите корректный номер телефона' }]}>
                        <Input placeholder="Введите номер телефона" />
                    </Form.Item>
                    <Form.Item label="Способ получения" name="deliveryMethod" rules={[{ required: true, message: 'Выберите способ получения' }]}>
                        <Select placeholder="Выберите способ получения">
                            <Option value="pickup">Самовывоз</Option>
                            <Option value="delivery">Доставка</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </div>
        </>
    );
}

export default OrderPage;

