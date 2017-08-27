import React, { Component } from 'react'
import { Helmet } from 'react-helmet'

import EPListTable from './EPListTable'
import EPListCalculator from './EPListCalculator'

class EPList extends Component {
  shouldComponentUpdate() {
    return false
  }

  render() {
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

        <section className="section">
          <h2 className="title">EP to Level Calculator</h2>
          <EPListCalculator />
        </section>

        <section className="section">
          <EPListTable />
        </section>
      </div>
    )
  }
}

export default EPList
