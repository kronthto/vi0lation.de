import React, { Component } from 'react'
import { callApi } from '../../middleware/api'
import config from '../../config'
import colors from '../../utils/colors'
import isEqual from 'lodash.isequal'
import AsyncLineChart from '../AsyncLineChart'
import { stringify } from 'querystring'

export const queryPlayers = (players, qs) => {
  return Promise.all(
    players.map(plName =>
      callApi(
        config.apibase +
          'chromerivals/playerfame?name=' +
          encodeURIComponent(plName) +
          (qs ? '&' + qs : ''),
        {},
        [404]
      )
    )
  )
}

export const buildPlayerFameDatasets = allData => {
  let datasets = []

  allData.forEach((player, i) => {
    datasets.push({
      label: player.name,
      fill: false,
      data: player.data.map(row => {
        return {
          x: new Date(row.timestamp),
          y: row.fame
        }
      }),
      borderColor: colors[i],
      cubicInterpolationMode: 'monotone'
    })
  })

  return datasets
}

export const options = (scale = 'day') => {
  return {
    elements: {
      point: { radius: 0 }
    },
    responsive: true,
    title: {
      display: false
    },
    scales: {
      xAxes: [
        {
          gridLines: {
            display: false
          },
          type: 'time',
          time: {
            unit: scale
          },
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Date'
          },
          ticks: {
            major: {
              fontStyle: 'bold',
              fontColor: '#FF0000'
            }
          }
        }
      ],
      yAxes: [
        {
          display: true,

          scaleLabel: {
            display: true,
            labelString: 'Fame'
          }
        }
      ]
    }
  }
}

class PlayerFameChart extends Component {
  constructor(props) {
    super(props)
    this.state = { data: null }
  }

  componentDidMount() {
    this.queryData()
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!isEqual(this.props.names, nextProps.names)) {
      return true
    }

    if (!isEqual(this.state, nextState)) {
      return true
    }

    return false
  }

  // TODO: should/did auch from/to Änderung beachten

  componentDidUpdate(prevProps) {
    if (!isEqual(this.props.names, prevProps.names)) {
      this.queryData()
    }
  }

  queryData() {
    let extraQ = {}
    if (this.props.from) {
      extraQ.from = this.props.from
    }
    if (this.props.to) {
      extraQ.to = this.props.to
    }
    let dataPromise = queryPlayers(this.props.names, stringify(extraQ))
    this.setState({ data: null, loadingData: dataPromise })
    dataPromise.then(data => {
      this.setState({
        data: data.filter(player => typeof player === 'object'),
        loadingData: false
      })
    })
  }

  render() {
    const allData = this.state.data

    if (this.state.loadingData) {
      return (
        <div>
          <span className="button is-info is-loading" style={{ width: '80px' }}>
            ...
          </span>
        </div>
      )
    }

    if (!allData) {
      return null
    }
    if (allData.length === 0) {
      return (
        <div className="notification is-info">
          No data available or player not found
        </div>
      )
    }

    return (
      <div>
        <AsyncLineChart
          options={options('day')}
          data={{ datasets: buildPlayerFameDatasets(allData) }}
          type="line"
        />
      </div>
    ) // Additional div for the chartJS size monitor that would otherwise interfere with h1 "not first child" margin
  }
}

export default PlayerFameChart
