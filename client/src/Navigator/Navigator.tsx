import React from 'react';
import './Navigator.scss';

export default function Navigator({ currentQuestion, onPrevious, onNext})
{
	return (
		<div className="navigator">
			<div className="question-number">QUESTION {currentQuestion} / 50</div>
			<div className="button-container">
				<button onClick={onPrevious}>Previous</button>
				<button onClick={onNext}>Next</button>
			</div>
		</div>
	);
}
