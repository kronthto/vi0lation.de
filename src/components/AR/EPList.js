import React, { Component } from 'react'
import { Helmet } from 'react-helmet'

import EPListTable from './EPListTable'

class EPList extends Component {
  shouldComponentUpdate() {
    return false
  }

  render() {
    // TODO: Calculator

    return (
      <div>
        <Helmet>
          <meta
            name="description"
            content="AirRivals/AceOnline experience-point to level list"
          />
          <title>AirRivals/AceOnline EP List</title>
        </Helmet>

        <h1 className="title">EP List</h1>

        <EPListTable />
      </div>
    )
  }
}

export default EPList
