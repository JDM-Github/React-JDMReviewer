import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './index.css';
import QuestionaireRoute from './Routes/QuestionaireRoute/QuestionaireRoute.tsx';
import CreateRoute from './Routes/CreateRoute/CreateRoute.tsx';
import HomeRoute from './Routes/HomeRoute/HomeRoute.tsx';


ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<BrowserRouter>
				<Routes>
					<Route path="/" element={<HomeRoute />} />
					<Route path="/create" element={<CreateRoute />} />
					<Route path="/question" element={<QuestionaireRoute />} />
				</Routes>
			</BrowserRouter>
	</React.StrictMode>
);
