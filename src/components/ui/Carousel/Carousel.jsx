import React, {useState, useRef, useEffect, useCallback} from 'react';
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import './Carousel.css';

const Carousel = ({ images, containerStyles, showArrows = true }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);
    const totalImages = images.length;

    const nextImage = useCallback(() => {
        setIsAnimating(true);
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % totalImages);
    }, [totalImages]);

    const prevImage = useCallback(() => {
        setIsAnimating(true);
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + totalImages) % totalImages);
    }, [totalImages]);

    const handleTouchStart = (e) => {
        touchStartX.current = e.changedTouches[0].screenX;
    };

    const handleTouchMove = (e) => {
        touchEndX.current = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = () => {
        if (touchStartX.current - touchEndX.current > 50) {
            nextImage();
        }
        if (touchEndX.current - touchStartX.current > 50) {
            prevImage();
        }
    };


    // Сбрасываем анимацию после завершения
    useEffect(() => {
        const timeout = setTimeout(() => setIsAnimating(false), 300); // Время анимации должно совпадать с CSS
        return () => clearTimeout(timeout);
    }, [currentImageIndex]);

    return (
        <div className="carousel-wrapper" style={containerStyles}>
            <div
                className={`carousel-image-container ${isAnimating ? 'animate' : ''}`}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{
                    backgroundImage: `url(${images[currentImageIndex]})`,
                }}
            ></div>
            {showArrows && (
                <>
                    <button className="carousel-button prev" onClick={prevImage}>
                        <IoChevronBack size={24}/>
                    </button>
                    <button className="carousel-button next" onClick={nextImage}>
                        <IoChevronForward size={24}/>
                    </button>
                </>
            )}
            <div className="carousel-indicators">
                {images.map((_, index) => (
                    <span
                        key={index}
                        className={`indicator ${index === currentImageIndex ? 'active' : ''}`}
                        onClick={() => setCurrentImageIndex(index)}
                    ></span>
                ))}
            </div>
        </div>
    );
};

export default Carousel;
