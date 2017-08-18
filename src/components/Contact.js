import React, { Component } from 'react'
import { Helmet } from 'react-helmet'

const srcLinkFE = () => {
  return (
    <a
      href="https://github.com/kronthto/vi0lation.de"
      target="_blank"
      title="vi0lation.de Frontend Source-Code"
      rel="noopener noreferrer"
    >
      Frontend
    </a>
  )
}

const srcLinkBE = () => {
  return (
    <a
      href="https://github.com/kronthto/api.vi0lation.de"
      target="_blank"
      title="Ranking-Data api.vi0lation.de Source-Code"
      rel="noopener noreferrer"
    >
      API-Backend
    </a>
  )
}

const TS3Ref = () => {
  return (
    <span>
      Address:{' '}
      <a href="ts3server://vi0lation.de" title="Vi0 TeamSpeak 3 Server">
        vi0lation.de
      </a>
    </span>
  )
}

class Contact extends Component {
  shouldComponentUpdate() {
    return false
  }

  render() {
    return (
      <div>
        <Helmet>
          <meta
            name="description"
            content="Contact information for this website and the guild"
          />
          <title>Contact</title>
        </Helmet>

        <h1>Contact</h1>

        <section className="section">
          <h2 className="title">Tech guy</h2>
          <p>
            TODO: Tobias Card with Contact Information (Email), _linked_ IGNs
          </p>
        </section>

        <section className="section">
          <h2 className="title">TeamSpeak</h2>
          <p>
            {TS3Ref()}
          </p>
        </section>

        <section className="section">
          <h2 className="title">Source-Code</h2>
          <ul>
            <li>
              {srcLinkFE()}
            </li>
            <li>
              {srcLinkBE()}
            </li>
          </ul>
        </section>
      </div>
    )
  }
}

export default Contact
export { srcLinkFE, srcLinkBE, TS3Ref }
