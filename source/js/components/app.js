import React from 'react';
import R, { Router, Route, IndexRoute } from 'react-router';
import Header from 'components/header';

import RunePage from 'pages/runepage';

export default class App extends React.Component {
    render() {
        return (
            <div>
                <Header />

                <main id="main">
                    <Router>
                        <Route path="runes" component={RunePage} />

                        <Router path="*" component={class Default extends React.Component {
                            render() {
                                window.location.href = '#/runes';
                                return (<div/>);
                            }
                        }}/>
                    </Router>
                </main>
            </div>
        )
    }
}