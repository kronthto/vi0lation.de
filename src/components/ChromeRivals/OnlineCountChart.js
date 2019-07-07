import React, { Component } from 'react'
import { callApi } from '../../middleware/api'
import config from '../../config'
import { seriesColorCoding } from '../../utils/colors'
import AsyncLineChart from '../AsyncLineChart'
import isBefore from 'date-fns/is_before'
import subDays from 'date-fns/sub_days'

const options = (scale = 'day') => {
  return {
    elements: {
      point: { radius: 0 }
    },
    responsive: true,
    maintainAspectRatio: false,
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
            labelString: 'Pl. Count'
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

  /*
  componentDidUpdate(prevProps, prevState)
  {
    // Also need something to do it after initial render :/
    if (this.props.backdays !== prevProps.backdays) {
      this.refs.onlinescroll.scrollLeft = this.refs.onlinescroll.scrollWidth;
    }
  }
  */
  // TODO: Implement didUpdate when refetch is necessary based on backdays

  queryData() {
    let dataPromise = callApi(config.apibase + 'chromerivals/onlinecount')
    this.setState({ data: null, loadingData: dataPromise })
    dataPromise.then(data => {
      // TODO: Build averaged datasets
      this.setState({ data, loadingData: false })
    })
  }

  render() {
    if (this.state.loadingData) {
      // TODO?
      return (
        <div>
          <span className="button is-info is-loading" style={{ width: '80px' }}>
            ...
          </span>
        </div>
      )
    }

    const { data } = this.state
    const { backdays } = this.props

    if (!data) {
      return null
    }

    const startDate = subDays(new Date(), backdays)

    let serieses = { BCU: [], ANI: [] }

    data.forEach(row => {
      let dt = new Date(row.timestamp)

      if (isBefore(dt, startDate)) {
        return
      }

      if (row.total === 0) {
        return
      }

      if (backdays > 14 && dt.getMinutes() > 9) {
        return
      }

      serieses.BCU.push({
        x: dt,
        y: row.bcu
      })
      serieses.ANI.push({
        x: dt,
        y: row.ani
      })
    })

    let datasets = Object.keys(serieses).map(function(seriesKey) {
      return {
        fill: false,
        borderColor: seriesColorCoding[seriesKey],
        backgroundColor: seriesColorCoding[seriesKey],
        borderWidth: 1,
        //cubicInterpolationMode:'monotone',
        //steppedLine: true,
        //showLine: false,
        label: seriesKey,
        data: serieses[seriesKey],
        pointRadius: 3
      }
    })

    let width = 45 * backdays

    return (
      <div ref="onlinescroll" style={{ overflowX: 'scroll' }}>
        <div
          style={{
            width: width > window.innerWidth ? width + 'px' : '100%',
            height: '350px',
            position: 'relative'
          }}
        >
          <AsyncLineChart
            options={options(backdays < 4 ? 'hour' : 'day')}
            data={{ datasets }}
            type="line"
          />
        </div>
      </div>
    )
  }
}

export default PlayerFameChart
