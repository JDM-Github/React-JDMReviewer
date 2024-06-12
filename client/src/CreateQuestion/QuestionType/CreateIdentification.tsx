import React, { useState, useEffect } from 'react';
import RequestHandler from '../../Functions/RequestHandler.js';

export default function CreateIdentification({ setIsTypeQuestionUpdated, isUpdating, setIsUpdating, id })
{
	const [text, setText] = useState(null);
	const [backendText, setBackendText] = useState(null);

	const handleChange = (event) => {
		setIsTypeQuestionUpdated(false);
		if (event.target.value !== backendText)
			setIsTypeQuestionUpdated(true);

		setText(event.target.value);
	}
	const updateBackend = () => {
		RequestHandler.handleRequest('get', `/api/identification/${id}`)
		.then((result) => {
			setText(result[0].message);
			setBackendText(result[0].message);
		})
	}
	useEffect(() => { updateBackend(); }, [setText, setBackendText, id]);

	useEffect(() => {
		if (isUpdating)
		{
			setIsUpdating(false);
			setIsTypeQuestionUpdated(false);
			RequestHandler.handleRequest('post', `/api/update-identification`,
				{identification_id: id, message: text}).then(() => updateBackend());
		}
	});

	return (
		<textarea
			spellcheck="false"
			className="identification"
			value={text}
			onChange={handleChange}
		/>
	);
}
