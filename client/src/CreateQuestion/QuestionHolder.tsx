import React, { useState, useEffect } from 'react';
import RequestHandler from '../Functions/RequestHandler.js';
import './QuestionHolder.scss';

function CreateIdentification({ selectedQuestion })
{
	return <input className="identification" />;
}

function CreateMultipleChoice({ selectedQuestion })
{
	return (
		<div className="create-multiplechoice">
			<div className="mulitplechoice">
				<input className="identification" placeholder={selectedQuestion}/>
				<div className="delete">DELETE</div>
			</div>
		</div>
	)
}

function CreateEnumeration({ selectedQuestion })
{
	return (
		<div className="create-identification">
			<input  />
		</div>
	)
}

function CreateMessage({ initialText })
{
	const [text, setText] = useState(initialText);

	const handleChange = (event) => setText(event.target.value);
	useEffect(() => setText(initialText), [initialText]);

	return (<textarea className="questions-question" spellcheck="false" value={text} onChange={handleChange}/>);
}

export default function QuestionHolder( {className, selectedQuestion} )
{
	const [ typeQuestion, setType ] = useState('NONE');
	const [backendData, setBackendData] = useState({});

	useEffect(() => {
		if (selectedQuestion !== null)
		{
			RequestHandler.handleRequest('get', `/api/get-question/${selectedQuestion}`)
			.then((result) => {
				setType(result[0].question_type);
				setBackendData(result[0]);
			});
		}
		else
		{
			setType("NONE");
			setBackendData({"message": ""});
		}
	}, [selectedQuestion, setType]);

	const handleChange = (event) => setType(event.target.value);
	const renderElement = () => {
		if (typeQuestion === 'IDENTIFICATION')
			return <CreateIdentification selectedQuestion={selectedQuestion} />;
		else if (typeQuestion === 'MULTIPLE CHOICE')
			return <CreateMultipleChoice selectedQuestion={selectedQuestion} />
		else if (typeQuestion === 'ENUMERATION')
			return <CreateEnumeration selectedQuestion={selectedQuestion} />
		return null;
	};

	return (
		<div className={`question-holder ${className}`}>
			<div className="questions-text">MODIFY QUESTION</div>
			<CreateMessage initialText={backendData.message} />
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
			<div className="button-container">
				<div className={`question-update ${selectedQuestion === null ? 'inactive' : ''}`}>UPDATE</div>
				<div className={`question-update ${selectedQuestion === null ? 'inactive' : ''}`}>DELETE</div>
			</div>
		</div>
	);
}
