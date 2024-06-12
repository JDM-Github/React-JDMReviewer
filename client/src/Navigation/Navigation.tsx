import React, {useState, useEffect} from 'react';
import { Link, useLocation  } from 'react-router-dom';

import RequestHandler from '../Functions/RequestHandler.js';
import './Navigation.scss';

export default function Navigation({ setSubjectQuestions, setQuestionAnswers })
{
	const [backendData, setBackendData] = useState(null);
	const [page, setPage] = useState(0);
	const location = useLocation();
	const itemsPerPage = 10;

	const handleNextPage = () => {
		if (backendData && (page + 1) * itemsPerPage < backendData.length) {
			setPage(prevPage => prevPage + 1);
		}
	}; 
	const handlePrevPage = () => {
		if (page > 0) {
			setPage(prevPage => prevPage - 1);
		}
	};

	useEffect(() => {
		RequestHandler.handleRequest('get', `/api/get-subjects`)
		.then((result) => { setBackendData(result); })
		.catch((error) => { setBackendData([]); });
	}, []);

	const handleChange = (event) => {
		if (event.target.value === "NONE") {
			setSubjectQuestions([]);
			return;
		}
		RequestHandler.handleRequest('get', `/api/get-question-ids/${event.target.value}`)
		.then((result) => {
			setSubjectQuestions(result);
			setQuestionAnswers(new Array(result.length).fill(''));
		});
	}

	return (
		<div className="navigation">
			<Link to="/" className="nav-items">HOME</Link>
			<Link to="/create" className="nav-items">CREATE</Link>
			{location.pathname === '/question' ? (
				<>
				<select className="nav-items select-nav" onChange={handleChange}>
					<option value="NONE">SELECT SUBJECT</option>
					{backendData ? backendData.slice(page * itemsPerPage, (page + 1) * itemsPerPage).map((item, index) => (
						<option key={index} value={item.id}>
							{item.subject}
						</option>
					)) : null}
				</select>
				<div>
					<button onClick={handlePrevPage} className={page === 0 ? 'inactive' : ''}>{"<<"}</button>
					<button onClick={handleNextPage} className={!backendData || (page + 1) * itemsPerPage >= backendData.length ? 'inactive' : ''}>{">>"}</button>
				</div>
				</>
			) : (
				<Link to="/question" className="nav-items">QUESTIONAIRE</Link>
			)}
			<Link to="/contact" className="nav-items">CONTACT ME</Link>
		</div>
	);
}