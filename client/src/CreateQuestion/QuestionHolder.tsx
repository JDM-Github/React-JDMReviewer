import React, { useState, useEffect } from 'react';
import RequestHandler from '../Functions/RequestHandler.js';
import CreateIdentification from './QuestionType/CreateIdentification.tsx';
import CreateMultipleChoice from './QuestionType/CreateMultipleChoice.tsx';
import CreateEnumeration    from './QuestionType/CreateEnumeration.tsx';
import CreateMessage        from './QuestionType/CreateMessage.tsx';
import './QuestionHolder.scss';

export default function QuestionHolder( {className, selectedQuestion} )
{
	const [isEdited, setIsEdited] = useState(false);
	const [isMessageUpdated, setIsMessageUpdated] = useState(false);
	const [isTypeQuestionUpdated, setIsTypeQuestionUpdated] = useState(false);

	const [typeQuestion, setType]       = useState('NONE');
	const [isUpdating, setIsUpdating]   = useState(false);
	const [backendData, setBackendData] = useState({});

	const updateQuestion = () => setIsUpdating(true);
	useEffect(() => {
		if (selectedQuestion !== null)
		{
			RequestHandler.handleRequest('get', `/api/get-question/${selectedQuestion}`)
			.then((result) => {
				setType(result[0].question_type);
				setBackendData(result[0]);
				setIsMessageUpdated(false);
				setIsTypeQuestionUpdated(false);
			})
			.catch((error) => {
				setType('NONE');
				setBackendData({"message": ""});
			});
		}
		else
		{
			setType("NONE");
			setBackendData({"message": ""});
		}
	}, [selectedQuestion, setType]);

	useEffect(() => {
		if (isUpdating)
		{
			setIsUpdating(false);
			setIsEdited(false);
			RequestHandler.handleRequest('post', `/api/update-question-type`,
				{question_id: selectedQuestion, type: typeQuestion});
		}
	});

	const handleChange = (event) => {
		setIsEdited(false);
		if (event.target.value !== backendData.question_type)
			setIsEdited(true);

		setType(event.target.value);
	}

	const renderElement = () => {
		if (typeQuestion === 'IDENTIFICATION')
			return <CreateIdentification setIsTypeQuestionUpdated={setIsTypeQuestionUpdated} isUpdating={isUpdating} setIsUpdating={setIsUpdating} id={backendData.identification_id} />;
		else if (typeQuestion === 'MULTIPLE CHOICE')
			return <CreateMultipleChoice setIsTypeQuestionUpdated={setIsTypeQuestionUpdated} isUpdating={isUpdating} setIsUpdating={setIsUpdating} id={backendData.multiple_choice_id} />
		else if (typeQuestion === 'ENUMERATION')
			return <CreateEnumeration setIsTypeQuestionUpdated={setIsTypeQuestionUpdated} isUpdating={isUpdating} setIsUpdating={setIsUpdating} id={backendData.enumeration_id} />
		return null;
	};

	return (
		<div className={`question-holder ${className}`}>
			<div className="questions-text">MODIFY QUESTION</div>
			<CreateMessage isUpdating={isUpdating} setIsMessageUpdated={setIsMessageUpdated} setIsUpdating={setIsUpdating} initialText={backendData.message} id={selectedQuestion}/>
			<select className="question-select" onChange={handleChange} value={typeQuestion}>
				{(selectedQuestion !== null) ?
				(
					<>
						<option>IDENTIFICATION</option>
						<option>MULTIPLE CHOICE</option>
						<option>ENUMERATION</option>
					</>
				) : <option>NONE</option>}

			</select>
			<div className="question-maker">{renderElement()}</div>
			<div className={`question-update ${selectedQuestion !== null &&
				(isEdited || isMessageUpdated || isTypeQuestionUpdated) ? '' : 'inactive'}`}
				onClick={updateQuestion}>UPDATE</div>
		</div>
	);
}
