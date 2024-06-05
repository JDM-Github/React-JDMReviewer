import React from 'react';

import RequestHandler from '../../Functions/RequestHandler.js';
import CreateQuestion from '../../CreateQuestion/CreateQuestion.tsx';
import Navigation from '../../Navigation/Navigation.tsx';
import Navigator from '../../Navigator/Navigator.tsx';

export default function CreateRoute( { className })
{
	return (
		<div className="main">
			<Navigation />
			<CreateQuestion />
		</div>
	);
}


