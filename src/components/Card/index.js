import React from 'react';
import './index.css'

const Card = ({ image, title, onClick, className, color }) => {
    return (
        <div className={`CardContainer ${className}`} style={{backgroundColor: `${color}` }} onClick={onClick}>
            <img className={`CardImage ${className}`} src={image} alt={title} />
            <a className={`CardTitle ${className}`}>{title}</a>
        </div>
    );
}

export default Card;
