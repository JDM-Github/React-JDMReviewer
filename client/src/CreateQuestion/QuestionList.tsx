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

	const updateQuestions = () => RequestHandler.handleRequest('get', `/api/get-question-ids/${selectedSubject}`)
		.then((result) => { setBackendData(result); });

	const addQuestion = () => RequestHandler.handleRequest('post', `/api/add-question`, {subject_id: selectedSubject})
		.then(() => updateQuestions());

	const deleteQuestion = () => {
		setSelectedQuestion(null);
		setActiveQuestion  (null);

		RequestHandler.handleRequest('post', '/api/del-question', {question_id: activeQuestion})
		.then(() => updateQuestions());
	}

	const handleClick = (id) => {
		setSelectedQuestion(null);
		setActiveQuestion  (null);
		if (selectedQuestion === id)
		{
			return;
		}
		setSelectedQuestion(id);
		setActiveQuestion(id);
	};
	useEffect(() => {
		updateQuestions()
	}, [selectedSubject]);

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
			<div className="button-container">
				{/*<div className="question-update">UPDATE</div>*/}
				<div className={`question-update ${selectedSubject === null ? 'inactive' : ''}`} onClick={addQuestion}>ADD</div>
				<div className={`question-update ${activeQuestion === null ? 'inactive' : ''}`} onClick={deleteQuestion}>DELETE</div>
			</div>
			
		</div>
	);
}
