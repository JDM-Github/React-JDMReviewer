import React, { useState, useEffect } from 'react';
import RequestHandler from '../../Functions/RequestHandler.js';

export default function CreateInputHolder({
	className, index,
	onInputChange, placeholder,
	text, id,
	setIsActive, isActive,
	isUpdating, onDelete,
	isEnumeration=false})
{
	const [textInput, setTextInput] = useState(text);
	const handleChange = (event) => {
		setTextInput(event.target.value);
		onInputChange(index, text !== event.target.value, null);
	}
	const handleSet = () => {
		setIsActive(id);
		onInputChange(index, null, id);
	}
	const handleDelete = () => onDelete(id, index);

	useEffect(() => {
		if (isUpdating)
		{
			RequestHandler.handleRequest('post', `/api/update-question-answer`, {id: id, message: textInput});
		}
	})

	return (
		<div className={className}>
			<textarea className="identification" spellcheck="false" value={textInput} placeholder={placeholder} onChange={handleChange}/>
			<div className="delete" onClick={handleDelete}>DELETE</div>
			{isEnumeration ? null : <div className={`delete ${!isActive ? '' : 'inactive'}`} onClick={handleSet}>SET</div>}
		</div>
	);
}
