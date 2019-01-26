import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Flatpickr from 'react-flatpickr'
import 'flatpickr/dist/themes/material_blue.css'
import dateformat from 'date-fns/format'
import NumTD from '../../components/AR/NumTD'
import { minDate, maxDate } from '../../data/dataset'
import { calcProgessBarByEp } from '../../utils/AR/ep'
import { fetchHighscoreIfNeeded } from '../../actions/highscores'
import { highscoresUrl } from '../../routes'
import withRouter from 'react-router/withRouter'

const region = 'de'

class Ranking extends Component {
  // TODO: shouldUpdate

  static fetchData(store, match) {
    return this.queryForDate(store.dispatch, match.params.date)
  }

  componentDidMount() {
    this.queryCurrentDate()
  }

  componentDidUpdate(prevProps) {
    if (this.props.date !== prevProps.date) {
      this.queryCurrentDate()
    }
  }

  queryCurrentDate() {
    const { dispatch, date } = this.props
    this.constructor.queryForDate(dispatch, date)
  }

  static queryForDate(dispatch, date) {
    let hsPromise = dispatch(fetchHighscoreIfNeeded(region, date))

    return hsPromise
  }

  dateSelected(v) {
    let dateSelected = dateformat(v[0], 'YYYY-MM-DD')
    const { date, history } = this.props

    if (date === dateSelected) {
      return
    }

    history.push(highscoresUrl + '/' + dateSelected)
  }

  tableInfo() {
    return (
      <tr>
        <th>
          <abbr title="Ladder position">#</abbr>
        </th>
        <th>Name</th>
        <th>Gear</th>
        <th>Level</th>
        <th>Fame</th>
        <th>
          <abbr title="Duel wins">W</abbr>
        </th>
        <th>
          <abbr title="Duel loses">L</abbr>
        </th>
        <th>
          <abbr title="PvP/Duel Points">P</abbr>
        </th>
        <th>Brigade</th>
        <th>Nation</th>
      </tr>
    )
  }

  renderLoadingIndicator() {
    const { data } = this.props
    if (data || data === false) {
      return null
    }
    return (
      <span className="button is-info is-loading" disabled>
        ...
      </span>
    )
  }

  renderForm() {
    const { date } = this.props

    return (
      // TODO: Auslagern von generischen Form Stuff
      <form onSubmit={e => e.preventDefault()} className="margin-bot">
        <div className="field is-horizontal">
          <div className="field-label is-normal">
            <label className="label" htmlFor="date">
              Date
            </label>
          </div>
          <div className="field-body">
            <div className="field is-narrow">
              <p className="control">
                <Flatpickr
                  id="date"
                  ref="dateinput"
                  onChange={this.dateSelected.bind(this)}
                  options={{
                    mode: 'single',
                    minDate,
                    maxDate,
                    defaultDate: date
                  }}
                  value={date}
                  className="input"
                />
              </p>
            </div>
            <div className="field">
              <div className="control">{this.renderLoadingIndicator()}</div>
            </div>
          </div>
        </div>
      </form>
    )
  }

  render() {
    const { data, date } = this.props
    const is404 = data === false

    if (is404 && this.context.router.staticContext)
      this.context.router.staticContext.statusCode = 404

    return (
      <div className="content">
        <Helmet>
          <meta
            name="description"
            content={`AirRivals.de / Prokyon Player Ranking/Highscores at the ${date}`}
          />
          <title>{`AirRivals.de ${date} Player Highscores`}</title>
        </Helmet>

        <h1 className="title">AirRivals.de Highscores</h1>
        <h2 className="subtitle is-5">{date}</h2>

        {this.renderForm()}

        {is404 ? (
          <div className="notification is-info">
            No data available for the selected date
          </div>
        ) : (
          this.renderTable(data)
        )}
      </div>
    )
  }

  renderTable(data) {
    return (
      <div className="scrollX">
        <table className="table is-striped is-hoverable">
          <thead>{this.tableInfo()}</thead>
          <tbody>
            {data &&
              data.map(function(row, idx) {
                return (
                  <tr key={row.name}>
                    <th>{idx + 1}</th>
                    <td>{row.name}</td>
                    <td>{row.gear}</td>
                    <td>{calcProgessBarByEp(row.data.ep, row.data.level)}</td>
                    <NumTD num={row.data.fame} />
                    <NumTD num={row.data.wins} />
                    <NumTD num={row.data.deaths} />
                    <NumTD num={row.data.pvppoints} />
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

Ranking.propTypes = {
  // TODO
}

Ranking.contextTypes = {
  router: PropTypes.shape({
    staticContext: PropTypes.object
  }).isRequired
}

const mapStateToProps = (state, ownProps) => {
  const regionData = state.highscores[region]
  const { date } = ownProps.match.params

  let data = null
  if (regionData) {
    const dateData = regionData[date]
    if (dateData) {
      data = dateData.data
    }
  }

  return {
    date,
    data
  }
}

export default withRouter(connect(mapStateToProps)(Ranking))
