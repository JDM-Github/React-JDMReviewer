import { useState, useEffect } from 'react';

import RequestHandler from '../../Functions/RequestHandler.js';
import Questionaire from '../../Questionaire/Questionaire.tsx';
import Navigation from '../../Navigation/Navigation.tsx';
import Navigator from '../../Navigator/Navigator.tsx';

function QuestionaireRoute()
{
	// const [data, setData] = RequestHandler.fetchDataFromServer('get', '/api', {"name": 1});
	const [currentQuestion, setCurrentQuestion] = useState(1);

	const handleNext     = () => setCurrentQuestion(Math.min(currentQuestion + 1, 50));
	const handlePrevious = () => setCurrentQuestion(Math.max(currentQuestion - 1, 1));

	useEffect(() =>
	{
		const handleKeyDown = (event: KeyboardEvent) =>
		{
			const activeElement = document.activeElement;
			const isInputActive = activeElement && 
				(activeElement.tagName === 'INPUT' || 
				activeElement.tagName === 'TEXTAREA' || 
				activeElement.tagName === 'SELECT' || 
				activeElement.getAttribute('contenteditable') === 'true');

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
			<Navigation />
			<Navigator currentQuestion={currentQuestion} onPrevious={handlePrevious} onNext={handleNext} />
			<Questionaire currentQuestion={currentQuestion} />
		</div>
	);
}

export default QuestionaireRoute;

