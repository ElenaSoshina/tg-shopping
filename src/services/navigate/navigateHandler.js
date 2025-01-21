
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";


const tg = window.Telegram.WebApp

const NavigateHandler = () => {
    const navigate = useNavigate();

    useEffect(() => {
        tg.ready()

        // Add event listener for MainButton
        tg.MainButton.onClick(() => {
            navigate('/order')
        })

        return () => {
            // Clean up event listener on unmount
            tg.MainButton.offClick(() => {
                navigate('/order')
            })
        }
    }, [navigate])
    return null
};

export default NavigateHandler;