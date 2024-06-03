import React from 'react';
import Slider from 'react-slick';
import { Card } from '../index';
import './index.css';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const Carousel = ({ items }) => {
    const settings = {
        arrows: true,
        centerMode: true,
        infinite: true,
        centerPadding: "0px",
        slidesToShow: 3,
        speed: 500,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    arrows: true,
                    centerMode: true,
                    centerPadding: '0px',
                    slidesToShow: 3
                }
            },
            {
                breakpoint: 480,
                settings: {
                    arrows: true,
                    centerMode: true,
                    centerPadding: '0px',
                    slidesToShow: 3
                }
            }
        ]
    };

    return (
        <div className="Carousel_container">
            <div className='Carousel_Title'>Истории учеников которые изменили все в себе и своей жизни!</div>
            <Slider {...settings}>
                {items.map((item, index) => (
                    <Card
                        key={index}
                        image={item.image}
                        title={item.title}
                        color={item.color}
                    />
                ))}
            </Slider>
        </div>
    );
};

export default Carousel;
