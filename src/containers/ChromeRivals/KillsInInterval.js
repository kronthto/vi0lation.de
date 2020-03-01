import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import dateformat from 'date-fns/format'
import subHours from 'date-fns/subHours'
import NumTD from '../../components/AR/NumTD'
import withRouter from 'react-router/withRouter'
import Link from 'react-router-dom/Link'
import { parse, stringify } from 'querystring'
import { callApiChecked } from '../../middleware/api'
import config from '../../config'
import { colorName } from '../../utils/AR/names'
import blankImg from '../../img/000000-0.png'
import { zonedTimeToUtc, utcToZonedTime, format } from 'date-fns-tz'
import { isNode } from '../../utils/env'
/*
import {
  buildPlayerFameDatasets,
  options as playerFameChartOpts,
  queryPlayers
} from '../../components/ChromeRivals/PlayerFameChart'
import AsyncLineChart from '../../components/AsyncLineChart'
*/

const serverTimeZone = 'Europe/Paris'
const browserTimeZone =
  Intl && Intl.DateTimeFormat
    ? Intl.DateTimeFormat().resolvedOptions().timeZone
    : serverTimeZone
const formatDateForTransfer = dateString => {
  let parseDate = new Date(dateString)
  if (isNaN(parseDate) || !(parseDate instanceof Date)) {
    return null
  }
  return format(parseDate, 'yyyy-MM-dd HH:mm:ssXXX', {
    timeZone: serverTimeZone
  })
}
const dateTimeLocalFormat = "yyyy-MM-dd'T'HH:mm:ss"

const StatTag = props => (
  <div className="tags has-addons" style={{ marginBottom: 0 }}>
    <span className="tag" style={{ minWidth: '75px' }}>
      {props.label}
    </span>
    <span className="tag is-primary" style={{ minWidth: '50px' }}>
      {props.val !== '' ? props.val.toLocaleString() : ''}
    </span>
  </div>
)

class KillsInInterval extends Component {
  constructor(props) {
    super(props)

    let nowServerTimeDate = utcToZonedTime(
      zonedTimeToUtc(new Date(), browserTimeZone),
      serverTimeZone
    )

    this.state = {
      result: null,
      resultNation: null,
      resultGearDeaths: null,
      nowServerTime: nowServerTimeDate,
      nowInServerTimezone: dateformat(nowServerTimeDate, dateTimeLocalFormat)
    }
    this.TableInfo = (
      <tr>
        <th>
          <abbr title="Ladder position">#</abbr>
        </th>
        <th>Name</th>
        <th>Fame-Diff</th>
        <th>Gear</th>
        <th>Brigade</th>
        <th>Nation</th>
      </tr>
    )
  }

  componentDidMount() {
    this.queryData()
    let latestKillDatePromise = callApiChecked(
      config.crapibase + 'latestKillDate'
    )
    latestKillDatePromise.then(res => {
      let resDate = new Date(res)
      this.setState({
        nowServerTime: resDate,
        nowInServerTimezone: dateformat(resDate, dateTimeLocalFormat)
      })
      this.preselectOnLoad()
    })
  }

  preselectOnLoad() {
    if (isNode) {
      return
    }
    const currentQs = this.getQueryParams()
    if (currentQs.from || currentQs.to) {
      return false
    }

    let qs = {
      from: dateformat(
        subHours(this.state.nowServerTime, 1),
        dateTimeLocalFormat
      ),
      to: this.state.nowInServerTimezone
    }
    this.props.history.replace({
      search: stringify(qs)
    })
    this.queryData(qs)
  }

  queryData(qsOrg) {
    if (!qsOrg) {
      qsOrg = this.getQueryParams()
    }

    if (!(qsOrg.to && qsOrg.from)) {
      this.setState({
        result: null,
        loadingData: null,
        topchartdata: null
      })
      return
    }

    let qs = {
      from: formatDateForTransfer(qsOrg.from),
      to: formatDateForTransfer(qsOrg.to)
    }
    if (!(qs.to && qs.from)) {
      this.setState({
        result: null,
        loadingData: null,
        topchartdata: null
      })
      return
    }

    let dateQuery = '?' + stringify(qs)

    let playerKillsPromise = callApiChecked(
      config.crapibase + 'killsBetween' + dateQuery
    )
    let nationKillsPromise = callApiChecked(
      config.crapibase + 'nationKillsBetween' + dateQuery
    )
    let gearDeathsPromise = callApiChecked(
      config.crapibase + 'gearDeathsBetween' + dateQuery
    )

    this.setState({
      resultNation: null,
      resultGearDeaths: null,
      result: null,
      loadingData: Promise.all([
        playerKillsPromise,
        nationKillsPromise,
        gearDeathsPromise
      ]),
      topchartdata: null // Make this working again?
    })
    playerKillsPromise.then(result => {
      if (!('stats' in result) || result.data.length === 0) {
        result = false
      }
      this.setState({ result, loadingData: false })
    })
    nationKillsPromise.then(result => {
      let resultObj = { BCU: 0, ANI: 0 }
      result.forEach(nation => {
        resultObj[nation.nation] = nation.killcount
      })
      this.setState({ resultNation: resultObj })
    })
    gearDeathsPromise.then(result => {
      let resultObj = { I: 0, M: 0, B: 0, A: 0 }
      result.forEach(gear => {
        resultObj[gear.gear] = gear.deathcount
      })
      this.setState({ resultGearDeaths: resultObj })
    })
  }

  getQueryParams() {
    return parse(this.props.location.search.substring(1))
  }

  dateSelected(v, arg) {
    console.log(v)
    const currentQs = this.getQueryParams()

    let dateSelected = v

    let { from, to } = currentQs

    switch (arg) {
      case 'from':
        from = dateSelected
        break
      case 'to':
        to = dateSelected
        break
      default:
        throw Error('arg not from/to')
    }

    if (currentQs.to === to && currentQs.from === from) {
      return
    }

    const { history } = this.props

    let qs = {}
    if (from) {
      qs.from = from
    }
    if (to) {
      qs.to = to
    }
    history.replace({
      search: stringify(qs)
    })
    this.queryData({
      from,
      to
    })
  }

  renderForm() {
    return (
      <form onSubmit={e => e.preventDefault()} className="margin-bot">
        <div className="field is-horizontal">
          <div className="field-label is-normal">
            <label className="label">Date From/To</label>
          </div>
          <div className="field-body">
            {this.renderDateField('from')}
            {this.renderDateField('to')}
          </div>
        </div>
      </form>
    )
  }

  renderDateField(fromto) {
    let current = this.getQueryParams()[fromto]
    return (
      <div className="field">
        <div className="control">
          <input
            type="datetime-local"
            className="input is-fullwidth"
            value={current || ''}
            name={fromto}
            id={fromto}
            min="2018-08-24T18:00:00"
            max={this.state.nowInServerTimezone}
            step="1"
            onChange={e => this.dateSelected(e.target.value, fromto)}
          />
        </div>
      </div>
    )
  }

  render() {
    const { result } = this.state

    const { from, to } = this.getQueryParams()

    let desc = 'Kill-Comparison / Ranking of CR players '
    if (from && to) {
      desc += `from ${from} to ${to}`
    } else {
      desc += 'during any timeframe'
    }

    return (
      <div className="content">
        <Helmet>
          <meta name="description" content={desc} />
          <title>{`ChromeRivals: Fame between`}</title>
        </Helmet>

        <h1 className="title">CR Fame between</h1>

        {this.renderForm()}

        {this.renderTable(result)}
      </div>
    )
  }

  renderResultStats(result) {
    if (!(result && result.stats)) {
      return null
    }

    const { stats } = result
    const countStats = stats.counts

    return (
      <div className="columns">
        <div className="column">
          <h3 className="subtitle">Kills</h3>
          <StatTag
            label="ANI"
            val={this.state.resultNation ? this.state.resultNation.ANI : ''}
          />
          <StatTag
            label="BCU"
            val={this.state.resultNation ? this.state.resultNation.BCU : ''}
          />
          <StatTag label="I" val={stats.byGear.I} />
          <StatTag label="M" val={stats.byGear.M} />
          <StatTag label="B" val={stats.byGear.B} />
          <StatTag label="A" val={stats.byGear.A} />
        </div>
        <div className="column">
          <h3 className="subtitle">Deaths</h3>
          <StatTag
            label="I"
            val={
              this.state.resultGearDeaths ? this.state.resultGearDeaths.I : ''
            }
          />
          <StatTag
            label="M"
            val={
              this.state.resultGearDeaths ? this.state.resultGearDeaths.M : ''
            }
          />
          <StatTag
            label="B"
            val={
              this.state.resultGearDeaths ? this.state.resultGearDeaths.B : ''
            }
          />
          <StatTag
            label="A"
            val={
              this.state.resultGearDeaths ? this.state.resultGearDeaths.A : ''
            }
          />
        </div>
        <div className="column">
          <h3 className="subtitle">Player-Count (Fame-Diff ≠ 0)</h3>
          {['I', 'M', 'B', 'A'].map(gear =>
            ['ANI', 'BCU'].map(nation => {
              let lbl = `${gear} ${nation}`
              return (
                <StatTag key={lbl} label={lbl} val={countStats[nation][gear]} />
              )
            })
          )}
        </div>
      </div>
    )
  }

  renderDataLoading() {
    if (this.state.loadingData) {
      return (
        <span className="button is-info is-loading" style={{ width: '80px' }}>
          ...
        </span>
      )
    }
    return null
  }

  renderTable(result) {
    let lastKillNum = null

    return (
      <div>
        {this.renderDataLoading()}
        <h2 className="subtitle">Stats</h2>
        {this.renderResultStats(result)}
        <div className="scrollX">
          <table className="table is-striped is-hoverable">
            <thead>{this.TableInfo}</thead>
            <tbody>
              {result &&
                result.data &&
                result.data.map(function(row, idx) {
                  let showLadder = lastKillNum !== row.killcount
                  lastKillNum = row.killcount

                  if (!row.player) {
                    console.warn('Row without player entity', row)
                    return null
                  }

                  return (
                    <tr key={row.player.name}>
                      <th>{showLadder ? idx + 1 : null}</th>
                      <td>
                        <Link
                          to={
                            '/fameChart?name=' +
                            encodeURIComponent(row.player.name)
                          }
                          style={{ color: 'inherit' }}
                        >
                          {colorName(row.player.name)}
                        </Link>
                      </td>
                      <NumTD num={row.killcount} />
                      <td>{row.player.gear}</td>
                      <td style={{ whiteSpace: 'nowrap' }}>
                        {row.player.brigade && (
                          <img
                            src={`${config.apibase}chromerivals/brigmark?name=${encodeURIComponent(
                              row.player.brigade
                            )}`}
                            alt={row.player.brigade}
                            width="24"
                            loading="lazy"
                            height="12"
                            style={{ height: '12px' }}
                            onError={e => {
                              e.target.onerror = null
                              e.target.src = blankImg
                            }}
                          />
                        )}{' '}
                        {row.player.brigade}
                      </td>
                      <td>{row.player.nation}</td>
                    </tr>
                  )
                })}
            </tbody>
            <tfoot>{this.TableInfo}</tfoot>
          </table>
        </div>
      </div>
    )
  }
}

export default withRouter(KillsInInterval)
