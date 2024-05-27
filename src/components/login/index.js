import React, { useState } from 'react';
import './index.css'

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Username:', username, 'Password:', password);
        // Here, you can add logic to verify the username and password
    };

    return (
        <div className="login-container" style={{margin: 'auto' }}>
            <h2 className='login-main-title'>ВХОД</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group" style={{ marginBottom: '10px' }}>
                    <label className="login-title" htmlFor="username">Username:</label>
                    <input
                        type="text"
                        className="input"
                        value={username}
                        onChange={handleUsernameChange}
                        required
                    />
                </div>
                <div className="form-group" style={{ marginBottom: '10px' }}>
                    <label className="login-title" htmlFor="password">Password:</label>
                    <input
                        type="password"
                        className="input"
                        value={password}
                        onChange={handlePasswordChange}
                        required
                    />
                </div>
                {/* <button type="submit" className='login-button'>Login</button> */}
                <div className="login-links">
                    {/* <a href="/forgot-password" className='link' >Forgot password?</a> */}
                    <a href="/register" className='link'>Для регистрации нажмите сюда</a>
                </div>
            </form>
        </div>
    );
}

export default Login;
