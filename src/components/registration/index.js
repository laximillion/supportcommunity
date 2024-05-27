import React, { useState } from 'react';
import './index.css'

function Register() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleFullNameChange = (event) => {
        setFullName(event.target.value);
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Full Name:', fullName, 'Email:', email, 'Password:', password);
    };

    return (
        <div className="registration-container">
            <h2 className='registration-main-title'>РЕГИСТРАЦИЯ</h2>

            <form onSubmit={handleSubmit}>
                <div className="form-group" style={{ marginBottom: '10px' }}>
                    <label htmlFor="fullName" className='registration-title'>Full Name:</label>
                    <input
                        type="text"
                        id="fullName"
                        value={fullName}
                        onChange={handleFullNameChange}
                        required
                        className='input'
                    />
                </div>
                <div className="form-group" style={{ marginBottom: '10px' }}>
                    <label htmlFor="email" className='registration-title'>Email:</label >
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={handleEmailChange}
                        required
                        className='input'
                    />
                </div>
                <div className="form-group" style={{ marginBottom: '10px' }}>
                    <label htmlFor="password" className='registration-title'>Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={handlePasswordChange}
                        required
                        className='input'
                    />
                </div>
                {/* <button type="submit" style={{ width: '100%', padding: '10px', fontSize: '16px' }}>Register</button> */}
            </form>
        </div>
    );
}

export default Register;
