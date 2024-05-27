// src/components/ResultComponent.jsx
import React, { useEffect } from 'react';
import styles from './ResultComponent.module.css';

const ResultComponent = () => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const skill = urlParams.get('skill');
    const explanation = urlParams.get('explanation');
    const category = urlParams.get('category');
    const categoryExplanation = urlParams.get('categoryExplanation');

    document.getElementById('result').textContent = skill;
    document.getElementById('result-description').textContent = explanation;
    document.getElementById('category').textContent = category;
    document.getElementById('category-explanation').textContent = categoryExplanation;
  }, []);

  return (
    <div className={styles['result-body']}>
      <div id="result-container" className={styles['result-container']}>
        <h1 id="result-title" className={styles['result-title']}>Ваш результат:</h1>
        <p id="result" className={styles['result-skill']}></p>
        <p id="result-description" className={styles['result-description']}></p>
        <h2 id="category-title">Подходящее сообщество:</h2>
        <p id="category"></p>
        <p id="category-explanation"></p>
        <button onClick={() => window.location.href = '/'} className={styles['result-button']}>Назад к тесту</button>
      </div>
    </div>
  );
};

export default ResultComponent;
