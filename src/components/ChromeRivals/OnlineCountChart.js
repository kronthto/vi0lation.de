import React, { Component } from 'react'
import { callApiChecked } from '../../middleware/api'
import config from '../../config'
import { seriesColorCoding } from '../../utils/colors'
import AsyncLineChart from '../AsyncLineChart'
import isBefore from 'date-fns/isBefore'
import subDays from 'date-fns/subDays'
import startOfHour from 'date-fns/startOfHour'
import startOfday from 'date-fns/startOfDay'

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

const aggregateToGrouped = aggregate =>
  Object.keys(aggregate).map(time => {
    let sumAni = 0
    let sumBcu = 0
    const rows = aggregate[time]
    const numRows = rows.length
    rows.forEach(row => {
      sumAni += row.ani
      sumBcu += row.bcu
    })
    return {
      timestamp: new Date(time),
      bcu: sumBcu / numRows,
      ani: sumAni / numRows
    }
  })

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
    let dataPromise = callApiChecked(
      config.apibase + 'chromerivals/onlinecount'
    )
    this.setState({ data: null, loadingData: dataPromise })
    dataPromise.then(data => {
      let dataEvery = []
      let groupHourly = {}
      let groupDaily = {}
      data.forEach(row => {
        if (row.total === 0) {
          return
        }
        let dt = new Date(row.timestamp)
        row.timestamp = dt
        dataEvery.push(row)

        let hour = startOfHour(dt)
        let day = startOfday(dt)
        day.setHours(Math.floor(dt.getHours() / 8) * 8)
        if (!(hour in groupHourly)) {
          groupHourly[hour] = []
        }
        if (!(day in groupDaily)) {
          groupDaily[day] = []
        }
        groupHourly[hour].push(row)
        groupDaily[day].push(row)
      })

      data = null

      this.setState({
        data: dataEvery,
        loadingData: false,
        dataHourly: aggregateToGrouped(groupHourly),
        dataDaily: aggregateToGrouped(groupDaily)
      })
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

    const { backdays } = this.props
    const data =
      backdays > 40
        ? this.state.dataDaily
        : backdays > 14 ? this.state.dataHourly : this.state.data

    if (!data) {
      return null
    }

    const startDate = subDays(new Date(), backdays)

    let serieses = { BCU: [], ANI: [] }

    data.forEach(row => {
      const dt = row.timestamp

      if (isBefore(dt, startDate)) {
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
