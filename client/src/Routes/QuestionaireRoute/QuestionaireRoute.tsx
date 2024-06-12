import { useState, useEffect } from 'react';

import RequestHandler from '../../Functions/RequestHandler.js';
import Questionaire from '../../Questionaire/Questionaire.tsx';
import Navigation from '../../Navigation/Navigation.tsx';
import Navigator from '../../Navigator/Navigator.tsx';

function QuestionaireRoute()
{
	const [subjectQuestions, setSubjectQuestions] = useState(null);
	const [questionAnswers, setQuestionAnswers] = useState([]);
	const [currentQuestion, setCurrentQuestion] = useState(1);

	const handleNext     = () => setCurrentQuestion(Math.min(currentQuestion + 1, subjectQuestions && subjectQuestions.length > 0 ? subjectQuestions.length : 1));
	const handlePrevious = () => setCurrentQuestion(Math.max(currentQuestion - 1, 1));

	useEffect(() =>
	{
		const handleKeyDown = (event: KeyboardEvent) =>
		{
			const activeElement = document.activeElement;
			const isInputActive = activeElement && 
				(activeElement.tagName === 'INPUT'
			  || activeElement.tagName === 'TEXTAREA'
			  || activeElement.tagName === 'SELECT'
			  || activeElement.getAttribute('contenteditable') === 'true');

			if (!isInputActive)
			{
				if (event.key === 'ArrowRight' || event.key === 'ArrowDown')
					handleNext();
				else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp')
					handlePrevious();
			}
		};
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);

	}, [handleNext, handlePrevious]);

	return (
		<div className="main">
			<Navigation setSubjectQuestions={setSubjectQuestions} setQuestionAnswers={setQuestionAnswers} />
			<Navigator currentQuestion={currentQuestion} subjectQuestions={subjectQuestions} onPrevious={handlePrevious} onNext={handleNext} />
			<Questionaire setQuestionAnswers={setQuestionAnswers} questionAnswers={questionAnswers} subjectQuestions={subjectQuestions} currentQuestion={currentQuestion} />
		</div>
	);
}

export default QuestionaireRoute;

