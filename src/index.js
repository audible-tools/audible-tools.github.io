import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import * as serviceWorker from './serviceWorker'
import ChecksumResolver from './ChecksumResolver'
import ReactNotification from 'react-notifications-component'
import ForkMeOnGithub from 'fork-me-on-github'

import ReactGA from 'react-ga'
import {
  GoogleReCaptchaProvider,
  GoogleReCaptcha,
} from 'react-google-recaptcha-v3'

WakeUp();

ReactGA.initialize('UA-174657678-1')
ReactGA.pageview(window.location.pathname + window.location.search)

ReactDOM.render(
  <div>
    <GoogleReCaptchaProvider reCaptchaKey="6LeZhMMhAAAAAH2cwtbCRYys5WawPj4KS5pw-GNd">
      {/* <GoogleReCaptcha
        onVerify={(a, b, c) => {
          console.log(`Token: ${a}`);
        }}
      /> */}
      <div style={{ display: 'flex' }}>
        <ReactNotification />
      </div>
      <ForkMeOnGithub
        repo="https://github.com/audible-tools/audible-tools.github.io"
        colorOctocat="black"
        isPride
      />
      <ChecksumResolver />
    </GoogleReCaptchaProvider>
  </div>,
  document.getElementById('root'),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()


async function WakeUp() {
  try{
    await fetch(`${process.env.REACT_APP_APISERVER}/api/v2/WakeUpNeo`)
    console.log("Woke up")
  }catch(ex){
    console.log("Error occured: "+ ex)
  }
}