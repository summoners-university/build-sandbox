import React from 'react';
//import { Link } from 'react-router';

export default class Header extends React.Component {
    render() {
        let hash = window.location.hash.replace(/\?.*/g, '');

        return (
            <header className='header'>
                <h1 className='page-title'>Summoner's University</h1>

                <div className='tabs'>
                    <a href='#/runes' className={hash == '#/runes' ? 'active' : ''}>Runes</a>
                </div>
            </header>
        )
    }
}