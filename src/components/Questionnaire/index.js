import React, { useState, useRef, useEffect } from 'react';
import './index.css';

function Questionnaire({ questions }) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState([]);
    const labelRef = useRef(null);
    const bottomPadding = 130.5;
    const [topPadding, setTopPadding] = useState(130.5);

    useEffect(() => {
        if (labelRef.current) {
            const labelHeight = labelRef.current.offsetHeight;
            const calculatedTopPadding = bottomPadding - labelHeight;
            setTopPadding(calculatedTopPadding > 0 ? calculatedTopPadding : 0);
        }
    }, [labelRef.current?.offsetHeight]);

    const handleOptionChange = (selectedOption) => {
        // Update the answers array to replace with the new input if it's from the input field
        const newAnswers = [...answers];
        newAnswers[currentQuestionIndex] = selectedOption;
        setAnswers(newAnswers);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('All answers:', answers);
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            // Handle the completion of the questionnaire here
        }
    };

    const handleBack = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const currentQuestion = questions[currentQuestionIndex];
    const isInputAnswer = typeof answers[currentQuestionIndex] === 'string';

    return (
        <form onSubmit={handleSubmit} className="questionnaireContainer" style={{ paddingTop: `${topPadding}px`, paddingBottom: `${bottomPadding}px` }}>
            <div ref={labelRef} style={{ marginBottom: '30px' }}>
                <a className='questionnaireLabel'>ВЫЯВИ СВОИ НАВЫКИ</a>
            </div>
            <div className="innerContainer">
                <h2 className='questionnaireTitle'>{currentQuestion.question}</h2>

                {currentQuestion.answers.map((answer, index) => (
                    <div key={index} className="checkbox-container">
                        <label className="label">
                            <input type="radio"
                                   name="option"
                                   checked={answers[currentQuestionIndex] === answer}
                                   onChange={() => handleOptionChange(answer)}
                            />
                            <span className="checkmark"></span>
                            {answer}
                        </label>
                    </div>
                ))}
                <input type="text"
                       value={isInputAnswer ? answers[currentQuestionIndex] : ''}
                       onChange={(e) => handleOptionChange(e.target.value)}
                       placeholder="Other (please specify)"
                       className="styledInput"
                />
                <div className="buttonContainer">
                    <button type="button" className="backButton" onClick={handleBack} disabled={currentQuestionIndex === 0}>
                        Back
                    </button>
                    <button type="submit" className="submitButton">
                        {currentQuestionIndex < questions.length - 1 ? 'Next' : 'Submit'}
                    </button>
                </div>
            </div>
        </form>
    );
}

export default Questionnaire;



// function Questionnaire() {
//     const [selectedOption, setSelectedOption] = useState('');
//     const [inputText, setInputText] = useState('');
//     const labelRef = useRef(null); // Reference to the label
//     const bottomPadding = 130.5; // Fixed bottom padding
//     const [topPadding, setTopPadding] = useState(130.5); // Initial top padding

//     useEffect(() => {
//         if (labelRef.current) {
//             const labelHeight = labelRef.current.offsetHeight;
//             const calculatedTopPadding = bottomPadding - labelHeight; // Adjusting the top padding
//             setTopPadding(calculatedTopPadding > 0 ? calculatedTopPadding : 0); // Ensure padding isn't negative
//         }
//     }, [labelRef.current?.offsetHeight]); // Depend on the label height to recalculate when it changes

//     const handleCheckboxChange = (option) => {
//         setSelectedOption(option);
//     };

//     const handleInputChange = (e) => {
//         setInputText(e.target.value);
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         console.log('Selected Option:', selectedOption);
//         console.log('Input Text:', inputText);
//     };

//     return (
//         <form onSubmit={handleSubmit} className="questionnaireContainer" style={{ paddingTop: `${topPadding}px`, paddingBottom: `${bottomPadding}px` }}>
//             <div ref={labelRef} style={{marginBottom: '30px'}}>
//               <a className='questionnaireLabel'>ВЫЯВИ СВОИ НАВЫКИ</a>
//             </div>
//             <div className="innerContainer">
//                 <h2 className='questionnaireTitle'>Do you play Brawl Stars during class and why do you think it's the best choice?</h2>
//                 {/* Labels and checkboxes */}
//                 <div className="checkbox-container">
//                     <label className="label">
//                         <input type="checkbox" name="option1" checked={selectedOption === 'option1'} onChange={() => handleCheckboxChange('option1')}/>
//                         <span className="checkmark"></span>

//                         I'm bored
//                     </label>
//                 </div>

//                 <div className="checkbox-container">
//                     <label className="label">
//                         <input type="checkbox" name="option2" checked={selectedOption === 'option2'} onChange={() => handleCheckboxChange('option2')}/>
//                         <span className="checkmark"></span>

//                         The class is uninteresting
//                     </label>
//                 </div>

//                 <div className="checkbox-container">
//                     <label className="label">
//                         <input type="checkbox" name="option3" checked={selectedOption === 'option3'} onChange={() => handleCheckboxChange('option3')}/>
//                         <span className="checkmark"></span>

//                         I don't like the teacher
//                     </label>
//                 </div>

//                 <div className="checkbox-container">
//                     <label className="label">
//                         <input type="checkbox" name="option4" checked={selectedOption === 'option4'} onChange={() => handleCheckboxChange('option4')}/>
//                         <span className="checkmark"></span>

//                         I'm tired
//                     </label>
//                 </div>

//                 <input type="text" name="inputText" value={inputText} onChange={handleInputChange} placeholder="Your comments" className="inputText" />
//                 <button type="submit" className="submitButton">Submit</button>
//             </div>
//         </form>
//     );
// }
