import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import dateformat from 'date-fns/format'
import NumTD from '../../components/AR/NumTD'
import { fetchDatesIfNeeded } from '../../actions/cr'
import { crTopKillsIntervalUrl } from '../../routes'
import withRouter from 'react-router/withRouter'
import { parse, stringify } from 'querystring'
import { callApi } from '../../middleware/api'
import config from '../../config'
import { colorName } from '../../utils/AR/names'

const CRDisclaimer = () => (
  <small>
    Server:{' '}
    <a
      href="https://chromerivals.net"
      target="_blank"
      rel="noopener noreferrer"
    >
      ChromeRivals
    </a>. Stats displayed here are based on leaderboard data kindly provided by
    their staff / API.
  </small>
)

class KillsInInterval extends Component {
  // TODO: shouldUpdate/Perf

  constructor(props) {
    super(props)
    this.state = { result: null }
  }

  componentDidMount() {
    this.context.rehydrated.then(() => {
      this.queryAvailableDates()
      this.queryData()
    })
  }

  queryAvailableDates() {
    this.props.dispatch(fetchDatesIfNeeded())
  }

  queryData(qs) {
    const { dispatch } = this.props

    if (!qs) {
      qs = this.getQueryParams()
    }

    let dataPromise = this.constructor.queryForDate(dispatch, qs.from, qs.to)
    this.setState({ result: null, loadingData: dataPromise })
    if (dataPromise) {
      dataPromise.then(result => {
        if (!('stats' in result)) {
          result = false
        }
        this.setState({ result, loadingData: false })
      })
    }
  }

  static queryForDate(dispatch, from, to) {
    if (!(to && from)) {
      return null
    }
    let endpoint =
      config.apibase +
      'chromerivals/topkillsinterval?' +
      stringify({
        from,
        to
      })
    let hsPromise = callApi(endpoint, {}, [400, 404])

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

    let qs = {
      from,
      to
    }
    history.replace(crTopKillsIntervalUrl + '?' + stringify(qs))
    this.queryData(qs)
  }

  tableInfo() {
    return (
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

  renderForm() {
    if (this.props.rankingDates === null || this.props.isFetchingDates) {
      return (
        <span className="button is-info is-loading" disabled>
          ...
        </span>
      )
    }

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
          <div className="select is-fullwidth">
            <select
              value={current}
              name={fromto}
              id={fromto}
              onChange={e => this.dateSelected(e.target.value, fromto)}
            >
              <option value="">Select {fromto} date ...</option>
              {this.props.rankingDates.map(date => (
                <option key={date}>{date}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    )
  }

  render() {
    const { result } = this.state
    const is404 = result === false

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

        <h1 className="title">ChromeRivals: Fame between</h1>

        {this.renderForm()}

        {is404 ? (
          <div className="notification is-info">
            No data available for the selected date
          </div>
        ) : (
          this.renderTable(result)
        )}

        <CRDisclaimer />
      </div>
    )
  }

  renderResultStats(result) {
    if (!(result && result.stats)) {
      return null
    }

    return (
      <ul style={{ fontWeight: 'bold' }}>
        <li>ANI: {result.stats.byNation.ANI.toLocaleString()}</li>
        <li>BCU: {result.stats.byNation.BCU.toLocaleString()}</li>
        <li>I: {result.stats.byGear.I.toLocaleString()}</li>
        <li>M: {result.stats.byGear.M.toLocaleString()}</li>
        <li>B: {result.stats.byGear.B.toLocaleString()}</li>
        <li>A: {result.stats.byGear.A.toLocaleString()}</li>
      </ul>
    )
  }

  renderDataLoading() {
    if (this.state.loadingData) {
      return (
        <span
          className="button is-info is-loading"
          disabled
          style={{ width: '80px' }}
        >
          ...
        </span>
      )
    }
    return null
  }

  renderTable(result) {
    return (
      <div>
        {this.renderDataLoading()}
        <div>{this.renderResultStats(result)}</div>
        <div className="scrollX">
          <table className="table is-striped is-hoverable">
            <thead>{this.tableInfo()}</thead>
            <tbody>
              {result &&
                result.data &&
                result.data.map(function(row, idx) {
                  return (
                    <tr key={row.name}>
                      <th>{idx + 1}</th>
                      <td>{colorName(row.name)}</td>
                      <NumTD num={row.diff} />
                      <td>{row.gear}</td>
                      <td>{row.brigade}</td>
                      <td>{row.nation}</td>
                    </tr>
                  )
                })}
            </tbody>
            <tfoot>{this.tableInfo()}</tfoot>
          </table>
        </div>
      </div>
    )
  }
}

KillsInInterval.contextTypes = {
  rehydrated: PropTypes.object.isRequired
}

const mapStateToProps = state => {
  const rankingDatesStore = state.cr.dates

  let rankingDates = null
  let isFetchingDates = false
  if (rankingDatesStore) {
    isFetchingDates = rankingDatesStore.isFetching
  }
  if (rankingDatesStore && 'data' in rankingDatesStore) {
    rankingDates = rankingDatesStore.data.map(date =>
      dateformat(date.replace(/\+.*$/, ''), 'YYYY-MM-DD HH:mm')
    )
  }

  return {
    rankingDates,
    isFetchingDates
  }
}

export default withRouter(connect(mapStateToProps)(KillsInInterval))
