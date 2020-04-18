import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import { callApiChecked } from '../../middleware/api'
import config from '../../config'
import { colorName } from '../../utils/AR/names'
import { format, utcToZonedTime } from 'date-fns-tz'

const BBTable = props => (
  <table className="table">
    <thead>
      <tr>
        <th>Name</th>
        <th>Kills</th>
        <th>Servertime</th>
      </tr>
    </thead>
    {props.data && (
      <tbody>
        {props.data.map(row => (
          <tr key={row.tb}>
            <td>{colorName(row.charactername)}</td>
            <td>{row.cnt}</td>
            <td>
              {format(
                utcToZonedTime(row.tb, 'Europe/Paris'),
                'yyyy-MM-dd HH:mm'
              )}
            </td>
          </tr>
        ))}
      </tbody>
    )}
  </table>
)

class TopLists extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    this.queryData()
  }

  queryData() {
    let hsPromise = callApiChecked(config.crapibase + 'lists/hs')
    let bbPromise = callApiChecked(config.crapibase + 'lists/bb')

    this.setState({ hsPromise, bbPromise, hs: null, bb: null })

    hsPromise.then(data => {
      this.setState({
        hs: data,
        hsPromise: false
      })
    })
    bbPromise.then(data => {
      this.setState({
        bb: data,
        bbPromise: false
      })
    })
  }

  render() {
    const title = 'ChromeRivals: All time statistics'

    const { bb, hs } = this.state

    return (
      <div className="content">
        <Helmet>
          <meta name="description" content="Server statistics, multikills" />
          <title>{title}</title>
        </Helmet>

        <h1 className="title">CR All time statistics</h1>

        <h2>Highest BBs</h2>

        <BBTable data={bb} />

        <hr />

        <h2>Highest HS</h2>

        <BBTable data={hs} />
      </div>
    )
  }
}

export default TopLists
