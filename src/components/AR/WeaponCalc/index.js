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
  prefix
  suffix

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
    callApi(
      config.apibase + 'chromerivals/omi?category=rareitems'
    ).then(allFixes => {
      let fixDb = Object.values(allFixes)
        .filter(fix => fix.probability !== 0)
        .sort((a, b) => a.probability - b.probability)
      this.setState({ fixDb })
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
    delete obj.fixDb
    return obj
  }

  renderFixSelect(saveAs, prefix) {
    const def = this.state[saveAs]
    return (
      <select
        id={saveAs}
        ref={saveAs}
        onChange={() => this.setState({ [saveAs]: this.refs[saveAs].value })}
        value={def || ''}
      >
        <option value="">-</option>
        {this.state.fixDb
          .filter(fix => {
            if (prefix) {
              return fix.id < 5000
            } else {
              return fix.id >= 5000
            }
          })
          .map(item => {
            return (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            )
          })}
      </select>
    )
  }

  render() {
    if (!this.state.itemdb || !this.state.fixDb) {
      return <LoadBlock height="100px" />
    }

    const { gear, selWeap, itemprefix, itemsuffix, fixDb } = this.state
    // eslint-disable-next-line
    this.selectedItem = this.gearItemDb.find(item => item.id == selWeap)
    this.prefix = fixDb.find(fix => fix.id == itemprefix)
    this.suffix = fixDb.find(fix => fix.id == itemsuffix)

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

        <div className="columns">
          <div className="column">
            <label className="label" htmlFor="itemprefix">
              Prefix
            </label>
            <div className="select is-fullwidth">
              {this.renderFixSelect('itemprefix', true)}
            </div>
          </div>

          <div className="column">
            <label className="label" htmlFor="itemsuffix">
              Suffix
            </label>
            <div className="select is-fullwidth">
              {this.renderFixSelect('itemsuffix', false)}
            </div>
          </div>
        </div>

        {this.selectedItem && (
          <WeaponPreview
            item={this.selectedItem}
            prefix={this.prefix}
            suffix={this.suffix}
          />
        )}
      </div>
    )
  }
}

export default withRouter(WeaponCalcTool)
