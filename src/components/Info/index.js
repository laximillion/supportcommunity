import React from 'react';
import './index.css'
import logo from '../../assets/logo.png'


const InfoComponent = ({ title, subtitle, description, buttonText }) => {

    return (
        <div className='Container_Info'>
            <div className='Wrapper'>
                <div className='TitleWrapper'>
                    <a className='Title'>{title}</a>
                    <a className='Subtitle'>{subtitle}</a>
                </div>

                <a className='Description'>{description}</a>

                <button class="Button">{buttonText}</button>
            </div>
            
                <img src={logo} alt="logo" className='Logo'/>
        </div>
    );
};

export default InfoComponent;
