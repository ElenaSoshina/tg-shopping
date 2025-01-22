import {useLocation} from "react-router-dom";
import {useEffect} from "react";



const LocationHandler = ({ setCartButtonVisibility}) => {
    const location = useLocation();

    useEffect(() => {
        if (location.pathname === '/') {
            setCartButtonVisibility(true)
        }
    }, [location, setCartButtonVisibility])
    return null
}

export default LocationHandler