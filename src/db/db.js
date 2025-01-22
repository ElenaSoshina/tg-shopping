import burgerImg from '../images/burger.png'
import pizzaImg from '../images/pizza.png'
import cocaImg from '../images/coca.png'
import icecreamImg from '../images/icecream.png'
import kebabImg from '../images/kebab.png'
import saladImg from '../images/salad.png'
import waterImg from '../images/water.png'

export function getData() {
    return [
        {id: 1, title: 'Burger', price: 15, image: burgerImg},
        {id: 2, title: 'Pizza', price: 17.99, image: pizzaImg},
        {id: 3, title: 'Coca', price: 3.5, image: cocaImg},
        {id: 4, title: 'IceCream', price: 2.99, image: icecreamImg},
        {id: 5, title: 'Kebab', price: 13.99, image: kebabImg},
        {id: 6, title: 'Salad', price: 2.50, image: saladImg},
        {id: 7, title: 'Water', price: 0.99, image: waterImg},
    ]
}
