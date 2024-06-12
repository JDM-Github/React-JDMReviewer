import React, { useState } from 'react';
import QuestionList from './QuestionList.tsx';
import QuestionListContainer from './QuestionListContainer.tsx';
import QuestionHolder from './QuestionHolder.tsx';

import './CreateQuestion.scss';

export default function CreateQuestion()
{
	const [selectedSubject, setSelectedSubject]   = useState(null);
	const [selectedQuestion, setSelectedQuestion] = useState(null);
	return (
		<div className="create-question">
			<QuestionListContainer selectedSubject={selectedSubject} setSelectedSubject={setSelectedSubject} setSelectedQuestion={setSelectedQuestion} className="left-container" />
			<QuestionList selectedSubject={selectedSubject} setSelectedQuestion={setSelectedQuestion} selectedQuestion={selectedQuestion} className="middle-container" />
			<QuestionHolder selectedQuestion={selectedQuestion} className="right-container" />
		</div>
	);
}
