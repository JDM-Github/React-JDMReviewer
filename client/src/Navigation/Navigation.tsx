import React from 'react';
import { Link } from 'react-router-dom';

import './Navigation.scss';

export default function Navigation()
{
	return (
        <div className="navigation">
            <Link to="/" className="nav-items">HOME</Link>
            <Link to="/create" className="nav-items">CREATE</Link>
            <Link to="/question" className="nav-items">SELECT QUESTION</Link>
            <Link to="/contact" className="nav-items">CONTACT ME</Link>
        </div>
    );
}