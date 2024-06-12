import React, { useState, useEffect } from 'react';
import RequestHandler from '../../Functions/RequestHandler.js';
import CreateInputHolder from './CreateInputHolder.tsx';

export default function CreateEnumeration({ setIsTypeQuestionUpdated, isUpdating, setIsUpdating, id })
{
	const [enumerationChoice, setEnumerationChoice] = useState(null);
	const [arrayChanged, setArrayChanged] = useState([]);

	const handleChange = (index, isChanged, setActive) => {
		setIsTypeQuestionUpdated(false);
		if (isChanged !== null)
		{
			const updatedChangesArray = [...arrayChanged];
			updatedChangesArray[index] = isChanged;
			setArrayChanged(updatedChangesArray);
			setIsTypeQuestionUpdated(updatedChangesArray.some(change => change === true));
		}
	}

	const addEnumerationHolder = () => {
		RequestHandler.handleRequest('post', `/api/add-enumeration`, {enumeration_id: id})
		.then(() => {
			RequestHandler.handleRequest('get', `/api/enumeration/${id}`)
			.then((result) => {
				setEnumerationChoice(result[0]);
				setArrayChanged([...arrayChanged, false]);
			});
		});
	}

	const deleteEnumerationHolder = (ids, index) => {
		RequestHandler.handleRequest('post', `/api/delete-enumeration`, {enumeration_id: id, idx: index})
		.then((res) => {
			RequestHandler.handleRequest('get', `/api/enumeration/${id}`)
			.then((result) => {
				setEnumerationChoice(result[0]);
				const updatedChangesArray = arrayChanged.filter((_, idx) => idx !== index);
				setArrayChanged(updatedChangesArray);
			});
		});
	}
	
	const updateBackend = () => {
		RequestHandler.handleRequest('get', `/api/enumeration/${id}`)
		.then((result) => {
			setEnumerationChoice(result[0]);
			setArrayChanged(new Array(result[0].question_answers.length).fill(false));
		});
	}
	useEffect(() => { updateBackend(); }, [id]);

	useEffect(() => {
		if (isUpdating)
		{
			setIsUpdating(false);
			setIsTypeQuestionUpdated(false)
			updateBackend();
		}
	});

	return (
		<div className="create-multiplechoice">
			{(enumerationChoice !== null) ? enumerationChoice.question_answers.map((answer, index) => (
				<CreateInputHolder 
					key={answer.id}
					index={index}
					onInputChange={handleChange}
					className="multiplechoice" 
					id={answer.id}
					text={answer.message}
					onDelete={deleteEnumerationHolder}
					isEnumeration={true}
				/>
			)) : null}
			<div className="add-inputholder" onClick={addEnumerationHolder}>ADD HOLDER</div>
		</div>
	)
}
