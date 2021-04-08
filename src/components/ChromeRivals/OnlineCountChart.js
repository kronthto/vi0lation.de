import React, { Component } from 'react'
import { callApiChecked } from '../../middleware/api'
import config from '../../config'
import { seriesColorCoding } from '../../utils/colors'
import AsyncLineChart from '../AsyncLineChart'
import isBefore from 'date-fns/isBefore'
import subDays from 'date-fns/subDays'
import startOfHour from 'date-fns/startOfHour'
import startOfday from 'date-fns/startOfDay'
import { utcToZonedTime } from 'date-fns-tz'

const average = arr =>
  arr.length ? arr.reduce((p, c) => p + c, 0) / arr.length : 0

const options = (scale = 'day', yLabelString = 'Pl. Count') => {
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
            labelString: yLabelString
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
    let diffSerieses = { BCU: [], ANI: [] }

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

      diffSerieses.ANI.push({
        x: dt,
        y: Math.max(0, row.ani - row.bcu)
      })
      diffSerieses.BCU.push({
        x: dt,
        y: Math.max(0, row.bcu - row.ani)
      })
    })

    let byHour
    if (backdays > 2) {
      byHour = { BCU: {}, ANI: {} }
      this.state.dataHourly.forEach(row => {
        const dt = row.timestamp

        if (isBefore(dt, startDate)) {
          return
        }

        if (row.ani > 0 || row.bcu > 0) {
          let serverTimeDate = utcToZonedTime(dt, 'Europe/Paris')
          let hour = serverTimeDate.getHours()
          if (!(hour in byHour.BCU)) {
            byHour.BCU[hour] = []
            byHour.ANI[hour] = []
          }
          byHour.BCU[hour].push(row.bcu)
          byHour.ANI[hour].push(row.ani)
        }
      })
    }

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
    let datasetsDiff = Object.keys(diffSerieses).map(function(seriesKey) {
      return {
        fill: true,
        borderColor: seriesColorCoding[seriesKey],
        backgroundColor: seriesColorCoding[seriesKey],
        borderWidth: 0,
        //cubicInterpolationMode:'monotone',
        steppedLine: true,
        //showLine: false,
        label: seriesKey,
        data: diffSerieses[seriesKey],
        pointRadius: 0
      }
    })

    let width = 45 * backdays

    let datasetsHeatmap
    if (byHour) {
      datasetsHeatmap = Object.keys(byHour).map(function(seriesKey) {
        let series = []
        for (let h = 0; h < 24; h++) {
          let hDate = new Date()
          hDate.setHours(h)
          hDate.setMinutes(30)
          hDate.setSeconds(0)
          if (!byHour[seriesKey][h]) {
            continue
          }
          series.push({
            x: hDate,
            y: average(byHour[seriesKey][h])
          })
        }
        return {
          fill: false,
          borderColor: seriesColorCoding[seriesKey],
          backgroundColor: seriesColorCoding[seriesKey],
          borderWidth: 1,
          //cubicInterpolationMode:'monotone', // ?
          //steppedLine: true,
          //showLine: false,
          label: seriesKey,
          data: series,
          pointRadius: 0
        }
      })
    }

    return (
      <React.Fragment>
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
          <h2 style={{ fontSize: '100%' }}>Nation difference</h2>
          <div
            style={{
              width: width > window.innerWidth ? width + 'px' : '100%',
              height: '200px',
              position: 'relative'
            }}
          >
            <AsyncLineChart
              options={options(backdays < 4 ? 'hour' : 'day', 'Nation diff')}
              data={{ datasets: datasetsDiff }}
              type="line"
            />
          </div>
        </div>
        {datasetsHeatmap && (
          <div
            style={{
              width: '100%',
              height: '350px',
              position: 'relative'
            }}
          >
            <h2 style={{ fontSize: '100%' }}>Average by servertime hour</h2>
            <AsyncLineChart
              options={options('hour', 'Hourly average')}
              data={{ datasets: datasetsHeatmap }}
              type="line"
            />
          </div>
        )}
      </React.Fragment>
    )
  }
}

export default PlayerFameChart
