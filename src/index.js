import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import RegisterScreen from './screens/RegisterScreen';
import LoginScreen from './screens/loginScreen';
import QuizComponent from './components/QuizComponent';
import ResultComponent from './components/ResultComponent';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="login" element={<LoginScreen />} />
        <Route path="register" element={<RegisterScreen />} />
        <Route path="quiz" element={<QuizComponent />} />
        <Route path="result" element={<ResultComponent />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
