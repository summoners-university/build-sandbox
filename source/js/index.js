import React from 'react';
import ReactDOM from 'react-dom';
import App from 'components/app';

document.addEventListener('DOMContentLoaded', function () {
    let state = window['__STATE__'] || {};
    ReactDOM.render(<App state={state} />, document.querySelector('#app-mount'));
});