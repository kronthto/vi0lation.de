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
  // TODO: shouldUpdate

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

    this.setState({ result: null })
    let dataPromise = this.constructor.queryForDate(dispatch, qs.from, qs.to)
    if (dataPromise) {
      dataPromise.then(result => {
        if (!('stats' in result)) {
          result = false
        }
        this.setState({ result })
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
    history.push(crTopKillsIntervalUrl + '?' + stringify(qs))
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
    if (!this.props.rankingDates) {
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
      <div className="field is-narrow">
        <div className="control">
          <div className="select">
            <select
              value={current}
              id={fromto}
              onChange={e => this.dateSelected(e.target.value, fromto)}
            >
              <option />
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

    return (
      <div className="content">
        <Helmet>
          <meta
            name="description"
            content={'Top kills by ChromeRivals player in any timeframe'}
          />
          <title>{`ChromeRivals Top fame by time`}</title>
        </Helmet>

        <h1 className="title">ChromeRivals Top fame by time</h1>

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

  renderTable(result) {
    return (
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
                    <td>{row.name}</td>
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
    )
  }
}

KillsInInterval.contextTypes = {
  rehydrated: PropTypes.object.isRequired
}

const mapStateToProps = state => {
  const rankingDatesStore = state.cr.dates

  let rankingDates = null
  if (rankingDatesStore && 'data' in rankingDatesStore) {
    rankingDates = rankingDatesStore.data.map(date =>
      dateformat(date, 'YYYY-MM-DD HH:mm')
    )
  }

  return {
    rankingDates
  }
}

export default withRouter(connect(mapStateToProps)(KillsInInterval))
