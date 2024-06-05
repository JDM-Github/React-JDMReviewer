import React, { useState, useEffect, useRef } from 'react';
import './Questionaire.scss';
import './AnswerButton.scss';
import './AnswerInput.scss';
import './AnswerInputEnumeration.scss';

function AnswerInput()
{
	return (
		<input className="answer-input" />
	);
}

function AnswerInputEnumeration()
{
	return (
		<div className="answer-input-enum-container">
			<input className="answer-input-enum" />
			<input className="answer-input-enum" />
			<input className="answer-input-enum" />
		</div>
	);
}

function AnswerButton()
{
	const [activeButton, setActiveButton] = useState(null);
	const handleButtonClick = (index) => {
		setActiveButton(index);
	};

	return (
		<div className="answer-button-container">
			{[...Array(4)].map((_, index) => (
				<div
					key={index}
					className={`answer-button ${activeButton === index ? 'active' : ''}`}
					onClick={() => handleButtonClick(index)}
				>{index}</div>
			))}
		</div>
	);
}

export default function Questionaire( {currentQuestion} )
{
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const scrollTo = () => window.scrollTo(0, 70);
		const timer = setTimeout(() => {
			if (containerRef.current)
				scrollTo();
		}, 100);
		return () => clearTimeout(timer);
	});

	return (
		<div ref={containerRef} className="questionaire">
			<div className="title">REVIEWER</div>
			<div className="msg-box">
			Hi JDM, This is just some ordinary text, ordinary and ordinary, just ordinary.
			Just shuddup already? freak Hi JDM, This is just some ordinary text, ordinary and ordinary, just ordinary.
			Just shuddup already? freak
			</div>
			<div className="answer-container">
				{currentQuestion === 1 && <AnswerInput />}
				{currentQuestion === 2 && <AnswerButton />}
				{currentQuestion === 3 && <AnswerInputEnumeration />}
			</div>
		</div>
	);
}
