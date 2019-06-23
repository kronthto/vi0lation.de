import React, { Component } from 'react'
import withRouter from 'react-router/withRouter'
import { callApi } from '../../../middleware/api'
import config from '../../../config'
import {
  unitKinds,
  standardWeapons,
  advWeapons,
  ITEMKIND_SKILL_ATTACK
} from '../../../data/ao'
import LoadBlock from '../../LoadBlock'
import WeaponPreview from './WeaponPreview'

class WeaponCalcTool extends Component {
  gearItemDb = []
  gearSkillDb = []
  selectedItem

  constructor(props) {
    super(props)

    let initState = {
      gear: 'B'
    }

    let hash = this.props.location.hash.substr(1)
    if (hash) {
      Object.assign(initState, JSON.parse(atob(hash)))
    }

    this.state = initState
  }

  filterItemDbs(itemdb, gear) {
    let itemDbGear = itemdb.filter(item => item.ReqUnitKind & unitKinds[gear])
    this.gearItemDb = itemDbGear.filter(
      item => [].concat(standardWeapons, advWeapons).indexOf(item.kind) !== -1
    )
    this.gearSkillDb = itemDbGear.filter(
      item => item.kind === ITEMKIND_SKILL_ATTACK
    )
  }

  componentDidMount() {
    callApi(
      config.apibase + 'chromerivals/omi?category=item'
    ).then(allItems => {
      let reducedItemDb = Object.values(allItems)
        .filter(item => {
          const { kind, ReqMinLevel } = item
          if (kind === ITEMKIND_SKILL_ATTACK) {
            return true
          }
          if (
            ReqMinLevel > 103 &&
            ReqMinLevel < 109 &&
            (advWeapons.indexOf(kind) !== -1 ||
              standardWeapons.indexOf(kind) !== -1)
          ) {
            return true
          }
          return false
        })
        .sort((a, b) => b.ReqMinLevel - a.ReqMinLevel)
      this.filterItemDbs(reducedItemDb, this.state.gear)
      this.setState({ itemdb: reducedItemDb })
    })
  }

  componentDidUpdate(prevProps, prevState) {
    this.props.history.replace({
      hash: btoa(JSON.stringify(this.serializeState()))
    })
  }

  serializeState() {
    let obj = Object.assign({}, this.state)
    delete obj.itemdb
    return obj
  }

  render() {
    if (!this.state.itemdb) {
      return <LoadBlock height="100px" />
    }

    const { gear, selWeap } = this.state
    // eslint-disable-next-line
    this.selectedItem = this.gearItemDb.find(item => item.id == selWeap)

    return (
      <div>
        <div className="tabs is-toggle is-fullwidth">
          <ul style={{ margin: 0 }}>
            {Object.keys(unitKinds).map(gearEach => (
              <li
                className={gear === gearEach ? 'is-active' : undefined}
                key={gearEach}
                style={{ marginTop: 0 }}
              >
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a
                  onClick={() => {
                    this.filterItemDbs(this.state.itemdb, gearEach)
                    this.setState({ gear: gearEach })
                  }}
                >
                  <span>{`${gearEach}-Gear`}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="columns">
          <div className="column">
            <label className="label" htmlFor="weapsel">
              Item
            </label>
            <div className="select is-fullwidth">
              <select
                id="weapsel"
                ref="weapsel"
                onChange={() =>
                  this.setState({ selWeap: this.refs.weapsel.value })}
                value={selWeap || ''}
              >
                <option value="">Select item ...</option>
                {this.gearItemDb.map(item => {
                  return (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  )
                })}
              </select>
            </div>
          </div>
        </div>

        {selWeap && <WeaponPreview item={this.selectedItem} />}
      </div>
    )
  }
}

export default withRouter(WeaponCalcTool)
