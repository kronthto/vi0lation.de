import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import dateformat from 'date-fns/format'
import diffMins from 'date-fns/differenceInMinutes'
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
// TODO: Prevent error if Intl is not defined in node or browsers
const browserTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
const formatDateForTransfer = dateString =>
  format(new Date(dateString), 'yyyy-MM-dd HH:mm:ssXXX', {
    timeZone: serverTimeZone
  })

const StatTag = props => (
  <div className="tags has-addons" style={{ marginBottom: 0 }}>
    <span className="tag" style={{ minWidth: '75px' }}>
      {props.label}
    </span>
    <span className="tag is-primary" style={{ minWidth: '50px' }}>
      {props.val.toLocaleString()}
    </span>
  </div>
)

class KillsInInterval extends Component {
  constructor(props) {
    super(props)
    this.state = { result: null }
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
    const nowServerTime = utcToZonedTime(
      zonedTimeToUtc(new Date(), browserTimeZone),
      serverTimeZone
    )
    this.nowInServerTimezone = dateformat(
      nowServerTime,
      "yyyy-MM-dd'T'HH:mm:ss"
    )
  }

  componentDidMount() {
    if (this.preselectOnLoad() === false) {
      this.queryData()
    }
  }

  preselectOnLoad() {
    if (isNode) {
      return
    }
    const currentQs = this.getQueryParams()
    if (currentQs.from || currentQs.to) {
      return false
    }
    return false // TODO
    let latestDate = this.props.rankingDates[0]
    let to = latestDate[0] + latestDate[1]

    let latestDateDate = new Date(latestDate[0] + latestDate[1])
    let from
    let fromDefault = this.props.rankingDates.find(
      // TODO: Latest hour, irgendwie noch runden?
      date => diffMins(latestDateDate, new Date(date[0] + date[1])) > 59
    )
    if (fromDefault) {
      from = fromDefault[0] + fromDefault[1]
    }

    let qs = {}
    if (from) {
      qs.from = from
    }
    if (to) {
      qs.to = to
    }
    this.props.history.replace({
      search: stringify(qs)
    })
    this.queryData({
      from,
      to
    })
  }

  queryData(qs) {
    if (!qs) {
      qs = this.getQueryParams()
    }

    let dataPromise = this.constructor.queryForDate(qs.from, qs.to) // TODO: Alle endpoints & promise.all
    this.setState({
      result: null,
      loadingData: dataPromise,
      topchartdata: null // Make this working again?
    })
    if (dataPromise) {
      dataPromise.then(result => {
        if (!('stats' in result)) {
          result = false
        }
        this.setState({ result, loadingData: false })
      })
    }
  }

  static queryForDate(from, to) {
    if (!(to && from)) {
      return null
    }
    let endpoint =
      config.crapibase +
      'killsBetween?' +
      stringify({
        from: formatDateForTransfer(from),
        to: formatDateForTransfer(to)
      })
    let hsPromise = callApiChecked(endpoint)

    return hsPromise
  }

  getQueryParams() {
    return parse(this.props.location.search.substring(1))
  }

  dateSelected(v, arg) {
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
            max={this.nowInServerTimezone}
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
          <StatTag label="ANI" val={'TODO'} />
          <StatTag label="BCU" val={'TODO'} />
          <StatTag label="I" val={stats.byGear.I} />
          <StatTag label="M" val={stats.byGear.M} />
          <StatTag label="B" val={stats.byGear.B} />
          <StatTag label="A" val={stats.byGear.A} />
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
