import burgerImg from '../images/burger.png'
import pizzaImg from '../images/pizza.png'
import cocaImg from '../images/coca.png'
import icecreamImg from '../images/icecream.png'
import kebabImg from '../images/kebab.png'
import saladImg from '../images/salad.png'
import waterImg from '../images/water.png'

export function getData() {
    return [
        {title: 'Burger', price: 15, image: burgerImg},
        {title: 'Pizza', price: 17.99, image: pizzaImg},
        {title: 'Coca', price: 3.5, image: cocaImg},
        {title: 'IceCream', price: 2.99, image: icecreamImg},
        {title: 'Kebab', price: 13.99, image: kebabImg},
        {title: 'Salad', price: 2.50, image: saladImg},
        {title: 'Water', price: 0.99, image: waterImg},
    ]
}
