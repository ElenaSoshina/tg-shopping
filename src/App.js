
import './App.css';
import Card from "./components/Card/Card";
import Cart from "./components/Cart/Cart";
import {useEffect, useState} from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import OrderPage from "./components/OrderPage/OrderPage";
import NavigateHandler from "./services/navigate/navigateHandler";

const { getData } = require('./db/db')

const foods = getData();

const tg = window.Telegram.WebApp

function App() {
    const [cartItems, setCartItems] = useState([])

    // Загружаем корзину из localStorage при монтировании
    useEffect(() => {
        const savedCartItems = JSON.parse(sessionStorage.getItem("cartItems"));
        if (savedCartItems) {
            setCartItems(savedCartItems)
        }
    }, [])

    // Сохраняем корзину в localstorage при изменении состояния
    useEffect(() => {
        if (cartItems.length > 0) {
            sessionStorage.setItem('cartItems', JSON.stringify(cartItems))
        }
    }, [cartItems]);

    useEffect(() => {
        if (cartItems.length > 0) {
            tg.MainButton.text = "VIEW ORDER";
            tg.MainButton.show();
        } else {
            tg.MainButton.hide();
        }
    }, [cartItems]);

    const onAdd = (food) => {
        const exist = cartItems.find(x => x.id === food.id);
        if (exist) {
            setCartItems(cartItems.map((x) => x.id === food.id ? {...exist, quantity: exist.quantity + 1 } : x));
        } else {
           setCartItems([...cartItems, {...food, quantity: 1 }]);
        }
    }

    const onRemove = (food) => {
        const exist = cartItems.find(x => x.id === food.id)
        if (exist.quantity === 1) {
            setCartItems(cartItems.filter(x => x.id !== food.id))
        } else {
            setCartItems(cartItems.map((x) => x.id === food.id ? {...exist, quantity: exist.quantity -1} : x))
        }
    }

  return (
      <Router>
          <NavigateHandler />
          <Routes>
              <Route path='/' element={
                  <>
                      <h1 className={'heading'}>Order food</h1>
                      <Cart cartItems={cartItems}/>
                      <div className="cards__container">
                          {foods.map(food => {
                              return <Card food={food} key={food.id} onAdd={onAdd} onRemove={onRemove} cartItems={cartItems}/>;
                          })}
                      </div>
                  </>
              }
              />
              <Route path="/order" element={<OrderPage cartItems={cartItems} onRemove={onRemove} onAdd={onAdd}/>}/>
          </Routes>
      </Router>

);
}

export default App;
