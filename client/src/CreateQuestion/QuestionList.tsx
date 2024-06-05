import React, {useState, useEffect} from 'react';
import RequestHandler from '../Functions/RequestHandler.js';
import './QuestionList.scss';

function QuestionContainer({text, onClick, className})
{
	return (
		<div onClick={onClick} className={`question-container ${className}`}>
			{text}
		</div>
	);
}

export default function QuestionList( {className, selectedSubject, setSelectedQuestion, selectedQuestion} )
{
	const [backendData, setBackendData] = useState([{}]);
	const [activeQuestion, setActiveQuestion] = useState(null);

	useEffect(() => {
		RequestHandler.handleRequest('get', `/api/get-question-ids/${selectedSubject}`)
		.then((result) => { setBackendData(result); });
	}, [selectedSubject]);

	const addQuestion = () => {

	};

	const handleClick = (id) => {
		if (selectedQuestion !== null)
		{
        	setSelectedQuestion(null);
        	setActiveQuestion(null);
			return;
		}
        setSelectedQuestion(id);
        setActiveQuestion(id);
    };

	return (
		<div className={`question-list ${className}`}>
			<div className="questions-text">ALL QUESTIONS</div>
			<div className="container">
				{backendData.map((item, index) => (
					<QuestionContainer key={index} text={index + 1}
						onClick={() => handleClick(item.id)}
						className={selectedQuestion !== null && activeQuestion === item.id ? 'active' : ''}
					/>
				))}
			</div>
			<div className={`question-update ${selectedSubject === null ? 'inactive' : ''}`} onClick={addQuestion}>ADD</div>
		</div>
	);
}
