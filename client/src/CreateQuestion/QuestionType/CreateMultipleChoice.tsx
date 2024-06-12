import React, { useState, useEffect } from 'react';
import RequestHandler from '../../Functions/RequestHandler.js';
import CreateInputHolder from './CreateInputHolder.tsx';

export default function CreateMultipleChoice({ setIsTypeQuestionUpdated, isUpdating, setIsUpdating, id })
{
	const [multipleChoice, setMultipleChoice] = useState(null);
	const [length, setLength] = useState(0);
	const [isActive, setIsActive] = useState(null);
	const [initialActive, setInitialActive] = useState(null);
	const [arrayChanged, setArrayChanged] = useState([]);

	const handleChange = (index, isChanged, setActive) => {
		if (length !== arrayChanged.length)
		{
			setIsTypeQuestionUpdated(true);
			return;
		}

		setIsTypeQuestionUpdated(false);
		if (setActive !== null)
		{
			if (initialActive !== setActive)
			{
				setIsTypeQuestionUpdated(true);
				return;
			}
		}
		else if (initialActive !== isActive)
		{
			setIsTypeQuestionUpdated(true);
			return;
		}
		else if (isChanged !== null)
		{
			const updatedChangesArray = [...arrayChanged];
			updatedChangesArray[index] = isChanged;
			setArrayChanged(updatedChangesArray);
			setIsTypeQuestionUpdated(updatedChangesArray.some(change => change === true));
		}
	}

	const addMultipleChoiceHolder = () => {
		RequestHandler.handleRequest('post', `/api/add-multiple-choice`, {multi_choice_id: id})
		.then(() => {
			RequestHandler.handleRequest('get', `/api/multiple_choice/${id}`)
			.then((result) => {
				setMultipleChoice(result[0]);
				setArrayChanged([...arrayChanged, false]);
			});
		});
	}

	const deleteMultipleChoiceHolder = (ids, index) => {
		RequestHandler.handleRequest('post', `/api/delete-multiple-choice`, {multi_choice_id: id, idx: index})
		.then((res) => {
			RequestHandler.handleRequest('get', `/api/multiple_choice/${id}`)
			.then((result) => {
				setMultipleChoice(result[0]);
				const updatedChangesArray = arrayChanged.filter((_, idx) => idx !== index);
				setArrayChanged(updatedChangesArray);
				if (isActive === ids)
				{
					if (length === updatedChangesArray.length)
						setIsTypeQuestionUpdated(false);
					setIsActive(initialActive);
				}
				if (initialActive === ids) setInitialActive(null);
			});
		});
	}

	const updateBackend = () => {
		RequestHandler.handleRequest('get', `/api/multiple_choice/${id}`)
		.then((result) => {
			setMultipleChoice (result[0]);
			setIsActive       (result[0].correct_answer_id);
			setInitialActive  (result[0].correct_answer_id);
			setLength         (result[0].question_answers.length);
			setArrayChanged   (new Array(result[0].question_answers.length).fill(false));
		});
	}
	useEffect(() => { updateBackend(); }, [id]);
	useEffect(() => {
		if (isUpdating)
		{
			setIsUpdating(false);
			setIsTypeQuestionUpdated(false);

			RequestHandler.handleRequest('post', `/api/update-multiple-choice-correct-id`,
			{multi_choice_id: id, correct_id: isActive}).then(() => { updateBackend(); })
		}
	});

	return (
		<div className="create-multiplechoice">
			{(multipleChoice !== null) ? multipleChoice.question_answers.map((answer, index) => (
				<CreateInputHolder 
					key={answer.id}
					index={index}
					onInputChange={handleChange}
					placeholder={String.fromCharCode(65 + index)}
					className="multiplechoice" 
					id={answer.id}
					text={answer.message}
					setIsActive={setIsActive}
					isUpdating={isUpdating}
					isActive={isActive === answer.id}
					onDelete={deleteMultipleChoiceHolder}
				/>
			)) : null}
			<div className="add-inputholder" onClick={addMultipleChoiceHolder}>ADD HOLDER</div>
		</div>
	)
}
