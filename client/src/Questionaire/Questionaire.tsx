import React, { useState, useEffect, useRef } from 'react';
import RequestHandler from '../Functions/RequestHandler.js';

import parseMessage from '../Functions/ParseMessage.js';
import './Questionaire.scss';
import './AnswerButton.scss';
import './AnswerInput.scss';
import './AnswerInputEnumeration.scss';

function AnswerInput({currentQuestion, setQuestionAnswers, questionAnswers, id})
{
	const [text, setText] = useState(null);
	const handleChange = (text) => {
		setText(text);
		const updatedQuestionAnswers = [...questionAnswers];
        updatedQuestionAnswers[currentQuestion-1] = text;
		setQuestionAnswers(updatedQuestionAnswers);
	}
	return (<input className="answer-input" value={text} onChange={(e) => handleChange(e.target.value)} />);
}

function AnswerInputEnumeration({currentQuestion, setQuestionAnswers, questionAnswers, id})
{
	const [enumeration, setEnumeration] = useState(null);
	const [answers, setAnswers] = useState([]);

	useEffect(() => {
		RequestHandler.handleRequest('get', `/api/enumeration/${id}`)
		.then((result) => {
			setEnumeration(result[0]);
			setAnswers(new Array(result[0].question_answers.length).fill(''));
		});
	}, [id]);

	const handleAnswerChange = (index, value) => {
        const newAnswers = [...answers];
        newAnswers[index] = value;
        setAnswers(newAnswers);

        const updatedQuestionAnswers = [...questionAnswers];
        updatedQuestionAnswers[currentQuestion-1] = newAnswers;
        setQuestionAnswers(updatedQuestionAnswers);

    };

	return (
		<div className="answer-input-enum-container">
			{(enumeration !== null) ? enumeration.question_answers.map((answer, index) => (
				<input
					key={index}
					className="answer-input-enum"
					value={answers[index]}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
				/>
			)) : null}
		</div>
	);
}

function AnswerButton({currentQuestion, setQuestionAnswers, questionAnswers, id})
{
	const [multipleChoice, setMultipleChoice] = useState(null);
	const [activeButton, setActiveButton] = useState(null);
	const handleButtonClick = (index) => {
		setActiveButton(index);
		const updatedQuestionAnswers = [...questionAnswers];
        updatedQuestionAnswers[currentQuestion-1] = multipleChoice.question_answers[index].id;
        setQuestionAnswers(updatedQuestionAnswers);
	}

	useEffect(() => {
		RequestHandler.handleRequest('get', `/api/multiple_choice/${id}`)
		.then((result) => setMultipleChoice(result[0]));
	}, [id]);

	return (
		<div className="answer-button-container">
			{(multipleChoice !== null) ? multipleChoice.question_answers.map((answer, index) => (
				<div
					key={index}
					className={`answer-button ${activeButton === index ? 'active' : ''}`}
					onClick={() => handleButtonClick(index)}
				>{answer.message}</div>
			)) : null}
		</div>
	);
}

function CreateMessage({ text }) {
	const parsedMessage = parseMessage(text);
	return (<div className="message-txtbox" dangerouslySetInnerHTML={{ __html: parsedMessage }} />);
}

export default function Questionaire( {subjectQuestions, currentQuestion, setQuestionAnswers, questionAnswers} )
{
	const [message, setMessage] = useState("");
	const [questionType, setQuestionType] = useState(null);
	const [identificationID, setIdentificationID] = useState(null);
	const [multipleChoiceID, setMultipleChoiceID] = useState(null);
	const [enumerationID, setEnumerationID] = useState(null);
	const containerRef = useRef<HTMLDivElement>(null);

	const introductionMessage = "${font={bold=true size=2rem color=#02D4F5}}\"JDM QUESTIONAIRE\"${/font} ${image={autodown=true src='https://avatars.githubusercontent.com/u/103527897?v=4' bordersize=2px radius=50px size=[100px, 100px]}}" +
		"JDM Questionaire is just literally a questionaire<br>" +
		"Visit and Follow me on Github ${image={autodown=false src='https://cdn.worldvectorlogo.com/logos/github-icon-2.svg' size=[20px, 20px]}}: ${link='https://github.com/JDM-Github'}.<br>" +
		"Visit and Follow me on Facebook ${image={autodown=false src='https://static-00.iconduck.com/assets.00/facebook-color-icon-2048x2048-bfly1vxr.png' size=[20px, 20px]}}: ${link='https://www.facebook.com/jdmaster888'}.<br>"
	;

	useEffect(() =>
	{
		const scrollTo = () => window.scrollTo({top: 65, behavior: 'smooth'});
		const timer = setTimeout(() =>
		{
			if (containerRef.current)
				scrollTo();
		}, 100);
		return () => clearTimeout(timer);
	});

	useEffect(() =>
	{
		if (!(subjectQuestions && subjectQuestions.length > 0))
		{
			setQuestionType(null);
			setIdentificationID(null);
			setMultipleChoiceID(null);
			setEnumerationID(null);
			setMessage(introductionMessage);
			return;
		}
		RequestHandler.handleRequest('get', `/api/get-question/${subjectQuestions[currentQuestion-1].id}`)
		.then((result) => {
			setQuestionType(result[0].question_type);
			setMessage(result[0].message);
			setIdentificationID(result[0].identification_id);
			setMultipleChoiceID(result[0].multiple_choice_id);
			setEnumerationID(result[0].enumeration_id);
		});
	});

	const renderElement = () =>
	{
		switch (questionType)
		{
        	case 'IDENTIFICATION':
            	return <AnswerInput setQuestionAnswers={setQuestionAnswers} currentQuestion={currentQuestion} questionAnswers={questionAnswers} id={identificationID} />;
        	case 'MULTIPLE CHOICE':
            	return <AnswerButton setQuestionAnswers={setQuestionAnswers} currentQuestion={currentQuestion} questionAnswers={questionAnswers} id={multipleChoiceID} />;
        	case 'ENUMERATION':
            	return <AnswerInputEnumeration setQuestionAnswers={setQuestionAnswers} currentQuestion={currentQuestion} questionAnswers={questionAnswers} id={enumerationID} />;
        	default:
            	return null;
    	}
	};

	return (
		<div ref={containerRef} className="questionaire">
			<div className="title">{(subjectQuestions && subjectQuestions.length > 0) ? "REVIEWER" : "INTRODUCTION"}</div>
			<div className="msg-box"><CreateMessage text={message}/></div>
			<div className="answer-container">{renderElement()}</div>
		</div>
	);
}
