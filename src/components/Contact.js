import React, { Component } from 'react'
import { Helmet } from 'react-helmet'

import tobiasImg from '../img/techguy_t.png'

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

          <div className="card">
            <div className="card-content">
              <div className="media">
                <div className="media-left">
                  <figure className="image is-48x48" style={{ margin: 0 }}>
                    <img src={tobiasImg} alt="Tobias" />
                  </figure>
                </div>
                <div className="media-content">
                  <p className="title is-4">Tobias</p>
                  <p className="subtitle is-6">
                    <abbr
                      title="In Game Name"
                      style={{ textDecoration: 'none' }}
                    >
                      IGN
                    </abbr>: DrDelay
                  </p>
                </div>
              </div>
              <div className="content">
                <p>
                  <span role="img" aria-label="Email" title="Email">
                    📧
                  </span>{' '}
                  <a href="mailto:info@vi0lation.de">info@vi0lation.de</a> (<a
                    href="https://cdn.vi0lation.de/secure/0x7DE1D5EB.asc"
                    title="PGP PubKey 1F60 FBDF B0F2 8AE9 68A6  50D5 DE0F 9DCA 7DE1 D5EB"
                  >
                    PGP
                  </a>)
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <h2 className="title">TeamSpeak</h2>
          <p>
            {TS3Ref()}
          </p>
        </section>

        <section className="section">
          <h2 className="title">Site Source-Code</h2>
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
