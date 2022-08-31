import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import ChecksumResolver from './ChecksumResolver';
import ReactNotification from 'react-notifications-component'
import ForkMeOnGithub from 'fork-me-on-github';


import ReactGA from 'react-ga';

fetch("https://api.audible-converter.ml/api/v2/WakeUpNeo")
  .then(data => console.log("Woke up, im ready to serve :D"))

ReactGA.initialize('UA-174657678-1');
ReactGA.pageview(window.location.pathname + window.location.search);

ReactDOM.render(
  <div>
    <div style={{display:'flex'}}>
    <ReactNotification />

    </div>
    <ForkMeOnGithub
      repo="https://github.com/audible-tools/audible-tools.github.io"
      colorOctocat="black"
      isPride
    />
    <ChecksumResolver />
  </div>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
