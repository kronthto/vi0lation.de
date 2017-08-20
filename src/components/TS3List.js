import React, { Component } from 'react'
import { Helmet } from 'react-helmet'

const TSRef = props => {
  let { url, port } = props.server

  return (
    <li>
      <a href={`ts3server://${url}`} title={`${url} TS3`}>
        {url}
      </a>{' '}
      (Port: {port})
    </li>
  )
}

class TS3List extends Component {
  static tsServers = [
    { url: 'vi0lation.de', port: 9987 },
    { url: 'aces.vi0lation.de', port: 9994 },
    { url: 'benson.vi0lation.de', port: 9991 },
    { url: 'epic.vi0lation.de', port: 9993 },
    { url: 'hon.vi0lation.de', port: 9990 },
    { url: 'topgun.vi0lation.de', port: 9988 },
    { url: 'um.vi0lation.de', port: 9989 },
    { url: 'unity.vi0lation.de', port: 9992 }
  ]

  shouldComponentUpdate() {
    return false
  }

  render() {
    return (
      <div>
        <Helmet>
          <meta
            name="description"
            content="Listing of the TeamSpeak 3 instances available"
          />
          <title>TeamSpeak 3 Server</title>
        </Helmet>

        <h1 className="title">TeamSpeak 3 Server</h1>

        <ul>
          {this.constructor.tsServers.map(server =>
            <TSRef key={server.url} server={server} />
          )}
        </ul>
      </div>
    )
  }
}

export default TS3List
