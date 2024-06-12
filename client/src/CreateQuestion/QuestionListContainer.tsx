import React, {useState, useEffect} from 'react';
import RequestHandler from '../Functions/RequestHandler.js';
import './QuestionListContainer.scss';

function QuestionContainer({id, text, onClick, className})
{
	const [inputText, setInputText]   = useState(text || "");
	const [isEditing, setIsEditing]   = useState(false);
	const [clickCount, setClickCount] = useState(0);

	useEffect(() => setInputText(text), [text]);

	// This will check if the clickCount happen within 300 milliseconds
	useEffect(() => {
		if (clickCount === 2)
		{
			setIsEditing(true);
			setClickCount(0);
		}
		const timer = setTimeout(() => setClickCount(0), 300);
		return () => clearTimeout(timer);
	}, [clickCount]);

	const handleClick = () => {
		if (clickCount === 0) onClick();
		setClickCount(prevCount => prevCount + 1);
	}
	const handleChange = (event) => setInputText(event.target.value || "NONE");
	const handleBlur = () => {
		setIsEditing(false);
		setClickCount(0);

		if (text === inputText) return;
		RequestHandler.handleRequest('put', `/api/update-subject/${id}`, { 'subject': inputText });
	};

	return (
		<div className={`question-container ${className}`} onClick={handleClick}>
		{isEditing ? (
		<input
			value={inputText}
			onChange={handleChange}
			onBlur={handleBlur}
			autoFocus
		/>) : inputText}
		</div>
	);
}

export default function QuestionListContainer( {className, selectedSubject, setSelectedSubject, setSelectedQuestion} ) 
{
	const [backendData, setBackendData] = useState([{}]);
	const [activeQuestion, setActiveQuestion] = useState(null);

	const updateSubjects = () => RequestHandler.handleRequest('get', `/api/get-subjects`)
		.then((result) => { setBackendData(result); })
		.catch((error) => { setBackendData({}); });

	const addSubject = () => RequestHandler.handleRequest('post', `/api/add-subject`)
		.then(() => updateSubjects());

	const deleteSubject = () => {
		setSelectedSubject (null);
		setSelectedQuestion(null);

		RequestHandler.handleRequest('post', '/api/del-subject', {subject_id: selectedSubject})
		.then(() => updateSubjects());
	}

	useEffect(() => {
		RequestHandler.handleRequest('get', `/api/get-subjects`)
		.then((result) => { setBackendData(result); })
		.catch((error) => { setBackendData({}); });
	}, []);

	const handleClick = (id) => {
		setSelectedQuestion(null);
		setSelectedSubject(id);
		setActiveQuestion(id);
	};

	return (
		<div className={`question-list-container ${className}`}>
			<div className="questions-text">SUBJECTS</div>
			<div className="container">
				{backendData.map((item, index) => (
					<QuestionContainer key={index} id={item.id} text={item.subject}
						onClick={() => handleClick(item.id)}
						className={activeQuestion === item.id ? 'active' : ''}
					/>
				))}
			</div>
			<div className="button-container">
				<div className="question-update" onClick={addSubject}>ADD</div>
				<div className={`question-update ${activeQuestion === null ? 'inactive' : ''}`} onClick={deleteSubject}>DELETE</div>
			</div>
		</div>
	);
}
