import React from 'react';
import './Navigator.scss';

export default function Navigator({ currentQuestion, subjectQuestions, onPrevious, onNext})
{
	return (
		<div className="navigator">
			<div className="question-number">QUESTION {currentQuestion} / {
				subjectQuestions && subjectQuestions.length > 0 ? subjectQuestions.length : 1}</div>
			<div className="button-container">
				<button className={currentQuestion === 1 ? 'inactive' : ''} onClick={onPrevious}>Previous</button>
				<button className={(subjectQuestions && subjectQuestions.length > 0 ? subjectQuestions.length : 1) <= currentQuestion ? 'inactive' : ''} onClick={onNext}>Next</button>
			</div>
		</div>
	);
}
