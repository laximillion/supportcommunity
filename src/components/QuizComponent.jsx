import React, { useState, useEffect } from 'react';
import styles from './QuizComponent.module.css';

const QuizComponent = () => {
  const [questionCount, setQuestionCount] = useState(1);
  const [answersData, setAnswersData] = useState([]);
  const [questionsData, setQuestionsData] = useState([]);
  const [resultReady, setResultReady] = useState(false);
  const [errorOccurred, setErrorOccurred] = useState(false);
  const [backMessage, setBackMessage] = useState(''); // State for back button message

  const minQuestions = 5;
  const maxQuestions = 15;
  const initialQuestion = "Какую деятельность вы предпочитаете?";
  const initialAnswers = [
    "Работать с людьми",
    "Работать с технологиями",
    "Творческая работа",
    "Работа на открытом воздухе"
  ];

  useEffect(() => {
    initializeQuestion();
    setQuestionsData([{ question: initialQuestion, answers: initialAnswers }]);
  }, []);

  const initializeQuestion = () => {
    document.getElementById('question').textContent = initialQuestion;
    const buttons = document.querySelectorAll(`.${styles['quiz-answer']}`);
    buttons.forEach((button, index) => {
      button.textContent = initialAnswers[index];
      button.classList.remove(styles.selected);
    });
    document.getElementById('open-answer').value = '';
    document.querySelector(`.${styles['open-answer']}`).classList.remove(styles.expanded);
    document.getElementById('send-open-answer').disabled = true;
    document.getElementById('back-button').disabled = true;
    document.getElementById('char-count').textContent = '100';
  };

  const handleAnswerClick = (answer, index) => {
    const currentQuestion = questionsData[questionCount - 1].question;
    const updatedAnswersData = [...answersData, { question: currentQuestion, answer }];
    setAnswersData(updatedAnswersData);
    document.querySelectorAll(`.${styles['quiz-answer']}`).forEach(btn => btn.classList.remove(styles.selected));
    document.querySelectorAll(`.${styles['quiz-answer']}`)[index].classList.add(styles.selected);
    document.querySelector(`.${styles['open-answer']}`).classList.remove(styles.expanded);
    fetchNextQuestionOrResult(updatedAnswersData);
  };

  const fetchNextQuestionOrResult = async (updatedAnswersData) => {
    if (errorOccurred) return;

    if (questionCount >= minQuestions && resultReady) {
      fetchResult(updatedAnswersData);
    } else if (questionCount < maxQuestions) {
      try {
        const response = await fetch('/api/generate-question', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedAnswersData)
        });
        const data = await response.json();

        if (data.question && data.answers) {
          setQuestionsData([...questionsData, { question: data.question, answers: data.answers }]);
          document.getElementById('question').textContent = data.question;
          const newAnswers = data.answers;
          const buttons = document.querySelectorAll(`.${styles['quiz-answer']}`);
          buttons.forEach((button, index) => {
            button.textContent = newAnswers[index] || '';
            button.classList.remove(styles.selected);
          });
          document.getElementById('open-answer').value = '';
          document.querySelector(`.${styles['open-answer']}`).classList.remove(styles.expanded);
          document.getElementById('send-open-answer').disabled = true;
          document.getElementById('back-button').disabled = false;
          setQuestionCount(questionCount + 1);
        } else if (data.skill && data.explanation) {
          setResultReady(true);
          fetchResult(updatedAnswersData);
        } else {
          console.error('Invalid response data:', data);
          alert('Произошла ошибка при получении следующего вопроса. Попробуйте снова.');
          setErrorOccurred(true);
        }
      } catch (error) {
        console.error('Error fetching new question:', error);
        alert('Произошла ошибка при получении следующего вопроса. Попробуйте снова.');
        setErrorOccurred(true);
      }
    } else {
      fetchResult(updatedAnswersData);
    }
  };

  const fetchResult = async (updatedAnswersData) => {
    try {
      const response = await fetch('/api/get-result', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedAnswersData)
      });
      const data = await response.json();

      if (data.skill && data.explanation) {
        const categoryResponse = await fetch('/api/get-category', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ skill: data.skill })
        });
        const categoryData = await categoryResponse.json();

        if (categoryData.category && categoryData.explanation) {
          window.location.href = `/result?skill=${encodeURIComponent(data.skill)}&explanation=${encodeURIComponent(data.explanation)}&category=${encodeURIComponent(categoryData.category)}&categoryExplanation=${encodeURIComponent(categoryData.explanation)}`;
        } else {
          console.error('Invalid category response data:', categoryData);
          alert('Произошла ошибка при определении категории. Попробуйте снова.');
          setErrorOccurred(true);
        }
      } else {
        console.error('Invalid result response data:', data);
        alert('Произошла ошибка при получении результата. Попробуйте снова.');
        setErrorOccurred(true);
      }
    } catch (error) {
      console.error('Error fetching result:', error);
      alert('Произошла ошибка при получении результата. Попробуйте снова.');
      setErrorOccurred(true);
    }
  };

  const handleOpenAnswerInput = (e) => {
    const input = e.target.value;
    document.getElementById('char-count').textContent = 100 - input.length;
    document.getElementById('send-open-answer').disabled = input.trim().length === 0;

    if (input.trim().length > 0) {
      document.querySelector(`.${styles['open-answer']}`).classList.add(styles.expanded);
    } else {
      document.querySelector(`.${styles['open-answer']}`).classList.remove(styles.expanded);
    }
  };

  const handleSendOpenAnswer = (e) => {
    e.preventDefault();
    const openAnswerInput = document.getElementById('open-answer').value.trim();
    const currentQuestion = questionsData[questionCount - 1].question;
    const updatedAnswersData = [...answersData, { question: currentQuestion, answer: openAnswerInput }];
    setAnswersData(updatedAnswersData);
    fetchNextQuestionOrResult(updatedAnswersData);
  };

  const handleBackButton = () => {

    if (questionCount > 1) {
        const newQuestionCount = questionCount - 1;
        setQuestionCount(newQuestionCount);
        console.log(`Going back to question ${newQuestionCount}`);

        const previousQuestion = questionsData[newQuestionCount - 1];
        setQuestionsData(questionsData.slice(0, newQuestionCount));
        setAnswersData(answersData.slice(0, newQuestionCount - 1));
        
        const buttons = document.querySelectorAll(`.${styles['quiz-answer']}`);
        buttons.forEach((button, index) => {
            button.textContent = previousQuestion.answers[index];
            button.classList.remove(styles.selected);
        });
        
        document.getElementById('question').textContent = previousQuestion.question;
        document.getElementById('open-answer').value = '';
        document.querySelector(`.${styles['open-answer']}`).classList.remove(styles.expanded);
        document.getElementById('send-open-answer').disabled = true;
        document.getElementById('back-button').disabled = newQuestionCount === 1;
    } else {
        initializeQuestion();
    }
};

useEffect(() => {
    if (questionCount === 1) {
        initializeQuestion();
    } else {
        const currentQuestion = questionsData[questionCount - 1];
        if (currentQuestion) {
            document.getElementById('question').textContent = currentQuestion.question;
            const currentAnswers = currentQuestion.answers;
            const buttons = document.querySelectorAll(`.${styles['quiz-answer']}`);
            buttons.forEach((button, index) => {
                button.textContent = currentAnswers[index] || '';
                button.classList.remove(styles.selected);
            });
            document.getElementById('open-answer').value = '';
            document.querySelector(`.${styles['open-answer']}`).classList.remove(styles.expanded);
            document.getElementById('send-open-answer').disabled = true;
            document.getElementById('back-button').disabled = questionCount === 1;
        }
    }
}, [questionCount, questionsData]);

return (
    <div className={styles['quiz-body']}>
        <div id="quiz-container" className={styles['quiz-container']}>
            <button id="back-button" className={styles['back-button']} onClick={handleBackButton} >↩</button>
            <h1 className={styles['quiz-title']}>ВЫЯВИ СВОИ НАВЫКИ</h1>
            <div id="questioncontainer" className={styles['question-container']}>
                <p id="question" className={styles['quiz-question']}>Какую деятельность вы предпочитаете?</p>
                <div id="answers">
                    {questionsData[questionCount - 1]?.answers.map((answer, index) => (
                        <button key={index} className={styles['quiz-answer']} onClick={() => handleAnswerClick(answer, index)}>
                            {answer}
                        </button>
                    ))}
                    <div className={styles['open-answer']}>
                        <input type="text" id="open-answer" placeholder="Ваш ответ (до 100 символов)" onInput={handleOpenAnswerInput} onKeyDown={(e) => e.key === 'Enter' && handleSendOpenAnswer(e)} />
                        <div id="char-count" className={styles['char-count']}>100</div>
                        <button id="send-open-answer" className={styles['send-open-answer']} onClick={handleSendOpenAnswer}>↩</button>
                    </div>
                </div>
                {backMessage && <p className={styles['back-message']}>{backMessage}</p>} {/* Display back message */}
            </div>
        </div>
    </div>
  );
}

export default QuizComponent;
