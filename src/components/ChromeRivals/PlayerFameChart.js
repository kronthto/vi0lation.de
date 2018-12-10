import React, { Component } from 'react'
import { callApi } from '../../middleware/api'
import config from '../../config'
import colors from '../../utils/colors'
import { Line } from 'react-chartjs-2'
import isEqual from 'lodash.isequal'

const options = {
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
          unit: 'day'
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

  componentDidUpdate(prevProps) {
    if (!isEqual(this.props.names, prevProps.names)) {
      this.queryData()
    }
  }

  queryData() {
    let dataPromise = this.constructor.queryPlayers(this.props.names)
    this.setState({ data: null, loadingData: dataPromise })
    dataPromise.then(data => {
      this.setState({ data, loadingData: false })
    })
  }

  static queryPlayers(players) {
    return Promise.all(
      players.map(plName =>
        callApi(
          config.apibase +
            'chromerivals/playerfame?name=' +
            encodeURIComponent(plName),
          {},
          [404]
        )
      )
    )
  }

  render() {
    const allData = this.state.data

    if (this.state.loadingData) {
      return (
        <div>
          <span
            className="button is-info is-loading"
            disabled
            style={{ width: '80px' }}
          >
            ...
          </span>
        </div>
      )
    }

    if (!allData) {
      return null
    }

    let datasets = []

    allData.forEach((player, i) => {
      if (typeof player !== 'object') {
        return
      }

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

    return <Line options={options} data={{ datasets }} />
  }
}

export default PlayerFameChart
