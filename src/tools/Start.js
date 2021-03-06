import React, { Component } from 'react'
import * as helpers from '../helpers'
import Logo from '../img/logo.png'

class Start extends Component {
  componentDidMount = () => {
    this.setParams()
  }

  // Defines the url params
  setParams(type) {
    helpers.setURLParams('')
  }

  render() {
    return (
      <div>
        <img src={Logo} width="300" alt="logo"/>
        <p><strong>KeyTools</strong> is a set of high performance web tools for <a href="https://nano.org">Nano Currency</a></p>
        <br/>
        <h4>SECURE</h4>
        <ul>
          <li>Secret keys are made from <a href="https://tweetnacl.js.org/#/">TweetNaCl</a>, a high-security cryptographic library</li>
          <li>The site works offline or by <a href="https://codeload.github.com/Joohansson/keytools/zip/gh-pages">downloading</a> and running the index.html from a secure local file system</li>
          <li>No cookies or analytics trackers exists and no data entered on the site are stored remotely</li>
        </ul>
        <h4>ACCESSIBLE</h4>
        <ul>
          <li>Quick access to tools with hotkeys SHIFT+ALT+0-9 (CTRL+SHIFT+ALT+0-9 for 10-20)</li>
          <li>Memo field at the bottom for copying data between tools</li>
          <li>Each tool support URL params which can be bookmarked, shared or linked from other tools</li>
          <li><strong>NOTE:</strong> The address bar won't be updated if running from a file system. However, URL parameters will still work. A valid workaround is to use this <a href="https://chrome.google.com/webstore/detail/web-server-for-chrome/ofhbbkphhbklhfoeikjpcbhemlocgigb">chrome webserver extension</a> and launch from <a href="http://localhost:8887/">localhost:8887</a>.<br/>
          The same is needed for the Audio Messenger to work when running from the file system.</li>
        </ul>
        <h4>AUDITABLE</h4>
        <ul>
          <li>Open sourced on <a href="https://github.com/Joohansson/keytools">Github</a></li>
          <li>This site is directly hosted on <a href="https://github.com/Joohansson/keytools/tree/gh-pages">Github Pages</a> and protected by Cloudflare</li>
        </ul>
        <h4>FREE</h4>
        <ul>
          <li>Contributions to this project can be done via Github PRs or by a Nano Donation below</li>
        </ul>
      </div>
    )
  }
}
export default Start
