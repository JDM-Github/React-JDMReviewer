import { useState, useEffect } from 'react';

import RequestHandler from '../../Functions/RequestHandler.js';
import Questionaire from '../../Questionaire/Questionaire.tsx';
import Navigation from '../../Navigation/Navigation.tsx';
import Navigator from '../../Navigator/Navigator.tsx';

export default function HomeRoute()
{
	return (
		<div className="main">
			<Navigation />
		</div>
	);
}
