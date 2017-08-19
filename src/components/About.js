import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'

import { srcLinkFE, srcLinkBE, TS3Ref } from './Contact'
import ytIcon from '../img/yt.png'

class About extends Component {
  shouldComponentUpdate() {
    return false
  }

  static ytVideoRef(url, title) {
    return (
      <a href={url} title={`YouTube: AirRivals - ${title}`} target="_blank">
        <img src={ytIcon} width="64" height="64" alt="YouTube" />
      </a>
    )
  }

  render() {
    return (
      <div>
        <Helmet>
          <meta
            name="description"
            content="About the Vi0lation guild and this website"
          />
          <title>About</title>
        </Helmet>

        <h1>About</h1>

        <section className="section">
          <h2 className="title">Vi0</h2>
          <p>
            Vi0(-lation) is a German multigaming clan/guild/brigade that formed
            on AirRivals DE (Prokyon, BCU), and since then continued playing
            various other MMOs & MOBAs together.
          </p>
        </section>

        <section className="section">
          <h2 className="title">TeamSpeak</h2>
          <p>
            {TS3Ref()}
          </p>
        </section>

        <section className="section">
          <h2 className="title">Website</h2>
          <p>
            The main purpose of this website is the{' '}
            <Link to="/ranking">advanced AirRivals DE ranking</Link>, providing
            near complete recordings of everydays ladders aswell as tools to
            analyze and compare them.
          </p>
          <p>
            First launched in 2012, it has seen quite some changes and
            relaunches. The first version being a bunch of PHP Scripts somehow
            fitting together it has evolved into an React SPA/PWA.<br />
            The current source code is available on GitHub, seperated into{' '}
            {srcLinkFE()} and {srcLinkBE()}.
          </p>
        </section>

        <section className="section">
          <h2 className="title">Videos</h2>
          <p style={{ height: '64px' }}>
            {this.constructor.ytVideoRef(
              'https://www.youtube.com/watch?v=Act1YKmPt2w',
              'AirRivals - Vi0lation 2.0'
            )}{' '}
            {this.constructor.ytVideoRef(
              'https://www.youtube.com/watch?v=OBiN8E8j7AM',
              'AirRivals - Vi0lation'
            )}
          </p>
        </section>
      </div>
    )
  }
}

export default About
