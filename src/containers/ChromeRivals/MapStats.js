import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import { callApiChecked } from '../../middleware/api'
import config from '../../config'
import { colorName } from '../../utils/AR/names'
import { isNode } from '../../utils/env'
import LoadBlock from '../../components/LoadBlock'
import { parse } from 'querystring'

class MapStats extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    this.queryData()
  }

  queryData() {
    if (isNode) {
      return
    }

    let heatmapImagePromise = callApiChecked(
      config.crapibase + 'heatmap/mapkills' + window.location.search
    )

    this.setState({ heatmapImagePromise, heatmapRes: null })

    heatmapImagePromise.then(data => {
      this.setState({
        heatmapRes: data,
        heatmapImagePromise: false
      })
    })
  }

  render() {
    const title = 'ChromeRivals: Map statistics'

    return (
      <div className="content">
        <Helmet>
          <title>{title}</title>
        </Helmet>

        {this.renderMain()}
      </div>
    )
  }

  renderMain() {
    const { heatmapRes } = this.state

    if (!heatmapRes) {
      return <LoadBlock height="400px" />
    }

    const query = parse(window.location.search.substring(1))

    return (
      <React.Fragment>
        <h1 className="title">{colorName(heatmapRes.mapname)}</h1>

        <h2>Kill position heatmap</h2>

        <dl>
          <dt>From</dt>
          <dd>{query.from}</dd>
          <dt>To</dt>
          <dd>{query.to}</dd>
        </dl>

        <img
          src={heatmapRes.heatmap}
          alt={heatmapRes.mapname + ' kill heatmap'}
        />
      </React.Fragment>
    )
  }
}

export default MapStats
