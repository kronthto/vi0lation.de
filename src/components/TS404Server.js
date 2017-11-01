import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import Link from 'react-router-dom/Link'

class TS404Server extends Component {
  shouldComponentUpdate() {
    return false
  }

  render() {
    return (
      <div>
        <Helmet>
          <meta
            name="description"
            content="Information about the TS3 404-Server"
          />
          <title>TS3 404-Server</title>
        </Helmet>

        <h1 className="title">TS3 404-Server</h1>

        <p>
          Getting routed to the 404-Server instead of your intended destination
          can generally mean two things:
        </p>
        <ul>
          <li>
            There was a temporary with the TSDNS service. Trying to connect
            again a bit later will most likely work.
          </li>
          <li>
            You entered an address that is not or no longer mapped to a server
          </li>
        </ul>
        <p>
          Refer to the <Link to="/ts3">list of available TS3 Servers</Link>.
        </p>
      </div>
    )
  }
}

export default TS404Server
