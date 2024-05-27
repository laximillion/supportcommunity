import react from 'react'

const Popup = ({active, setActive, description, title, color}) => {
    return (
        <div className='PopupContainer' style={{backgroundColor: `${color}` }}>
            <div className='PopupWrapper'>
                <img className='PopupImage'/>
                <a className='PopupTitle'>{title}</a>
            </div>

            <a className='PopupDescription'>{description}</a>
        </div>
    )
}

export default Popup