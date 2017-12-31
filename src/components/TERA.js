import React, { Component } from 'react'
import { Helmet } from 'react-helmet'

class TERA extends Component {
  shouldComponentUpdate() {
    return false
  }

  render() {
    return (
      <div>
        <Helmet>
          <meta
            name="description"
            content="TERA Online gameplay / services / stats"
          />
          <title>TERA</title>
        </Helmet>

        <h1 className="title">TERA</h1>

        <section className="section">
          <h2 className="title">DPS Meter Server</h2>
          An instance of{' '}
          <a
            href="https://github.com/kronthto/tera-dpsmeter-server"
            title="TERA DPS-Meter Server GitHub Repository"
          >
            tera-dpsmeter-server
          </a>{' '}
          is deployed at{' '}
          <a href="https://tera-dps.vi0lation.de">tera-dps.vi0lation.de</a>.
        </section>
      </div>
    )
  }
}

export default TERA
