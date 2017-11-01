import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import Link from 'react-router-dom/Link'

import { SrcLinkFE, SrcLinkBE, TS3Ref } from './Contact'
import ytIcon from '../img/youtube.svg'

const YtVideoRef = props => {
  let { url, title } = props
  return (
    <a href={url} title={`YouTube: AirRivals - ${title}`} target="_blank">
      <img src={ytIcon} width="48" height="48" alt="YouTube" />
    </a>
  )
}

class About extends Component {
  shouldComponentUpdate() {
    return false
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
          <p>{TS3Ref()}</p>
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
            <SrcLinkFE /> and <SrcLinkBE />.
          </p>
        </section>

        <section className="section">
          <h2 className="title">Videos</h2>
          <p style={{ minHeight: '48px' }}>
            <YtVideoRef
              url="https://www.youtube.com/watch?v=Act1YKmPt2w"
              title="AirRivals - Vi0lation 2.0"
            />{' '}
            <YtVideoRef
              url="https://www.youtube.com/watch?v=OBiN8E8j7AM"
              title="AirRivals - Vi0lation"
            />
          </p>
        </section>
      </div>
    )
  }
}

export default About
