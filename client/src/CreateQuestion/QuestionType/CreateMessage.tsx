import React, { useState, useEffect } from 'react';
import RequestHandler from '../../Functions/RequestHandler.js';

export default function CreateMessage({ initialText, isUpdating, setIsMessageUpdated, setIsUpdating, id})
{
	const [text, setText] = useState(initialText);

	const handleChange = (event) => {
		setIsMessageUpdated(false);
		if (event.target.value !== initialText)
			setIsMessageUpdated(true);

		setText(event.target.value);
	}
	useEffect(() => setText(initialText), [initialText]);

	useEffect(() => {
		if (isUpdating)
		{
			setIsUpdating(false);
			setIsMessageUpdated(false);
			RequestHandler.handleRequest('post', `/api/update-question-message`, {question_id: id, message: text});
		}
	});

	return (<textarea className="questions-question" spellCheck="false" value={text} onChange={handleChange}/>);
}
