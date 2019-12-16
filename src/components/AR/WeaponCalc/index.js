import React, { Component } from 'react'
import withRouter from 'react-router/withRouter'
import { callApi } from '../../../middleware/api'
import config from '../../../config'
import {
  unitKinds,
  standardWeapons,
  advWeapons,
  ITEMKIND_SKILL_ATTACK,
  ITEMKIND_DEFENSE,
  COMPARE_ITEMKIND,
  ITEMKIND_SKILL_DEFENSE,
  ITEMKIND_ENCHANT,
  DES_ENCHANT_INITIALIZE
} from '../../../data/ao'
import LoadBlock from '../../LoadBlock'
import WeaponPreview from './WeaponPreview'

const eqKinds = [ITEMKIND_DEFENSE].concat(standardWeapons, advWeapons)
const isEquip = item => eqKinds.indexOf(item.kind) !== -1

const bannedEnchantNames = ['Swift ', '%]', 'E10', 'FFA']
const isBannedEnchant = item =>
  bannedEnchantNames.some(
    bannedName =>
      item.name.includes(bannedName) ||
      DES_ENCHANT_INITIALIZE in item.DesParameters
  )

// noinspection JSBitwiseOperatorUsage
const enchantCardMatches = (card, item, gear) =>
  COMPARE_ITEMKIND(card.ReqItemKind, item.kind) &&
  card.ReqUnitKind & unitKinds[gear]

class WeaponCalcTool extends Component {
  gearItemDb = []
  gearSkillDb = []
  itemFixDb = []
  enchantItemDb = []
  selectedItem
  prefix
  suffix
  enchants

  constructor(props) {
    super(props)

    let initState = {
      gear: 'B',
      ench: {}
    }

    let hash = this.props.location.hash.substr(1)
    if (hash) {
      Object.assign(initState, JSON.parse(atob(hash)))
    }

    this.state = initState
  }

  filterItemDbs(itemdb, gear) {
    // noinspection JSBitwiseOperatorUsage
    let itemDbGear = itemdb.filter(item => item.ReqUnitKind & unitKinds[gear])
    this.gearItemDb = itemDbGear.filter(isEquip)
    this.gearSkillDb = itemDbGear.filter(
      item =>
        item.kind === ITEMKIND_SKILL_ATTACK ||
        item.kind === ITEMKIND_SKILL_DEFENSE
    )
  }

  componentDidMount() {
    callApi(
      config.apibase + 'chromerivals/omi?category=item'
    ).then(allItems => {
      let reducedItemDb = Object.values(allItems)
        .filter(item => {
          const { kind, ReqMinLevel, name } = item
          if (
            kind === ITEMKIND_SKILL_ATTACK ||
            kind === ITEMKIND_SKILL_DEFENSE ||
            kind === ITEMKIND_ENCHANT
          ) {
            return true
          }
          if (name.charAt(0) !== '\\') {
            return false
          }
          // noinspection RedundantIfStatementJS
          if (ReqMinLevel > 103 && ReqMinLevel <= 115 && isEquip(item)) {
            return true
          }
          return false
        })
        .sort((a, b) => b.ReqMinLevel - a.ReqMinLevel)
      this.filterItemDbs(reducedItemDb, this.state.gear)
      this.enchantItemDb = reducedItemDb.filter(
        item => item.kind === ITEMKIND_ENCHANT && !isBannedEnchant(item)
      )
      this.setState({ itemdb: reducedItemDb })
    })
    callApi(
      config.apibase + 'chromerivals/omi?category=rareitems'
    ).then(allFixes => {
      let fixDb = Object.values(allFixes)
        .filter(
          fix =>
            fix.probability !== 0 &&
            ['m', 'c', 'r', 'l', 'y'].indexOf(fix.name.charAt(1)) !== -1
        )
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
        {this.itemFixDb
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

  enchantAddCallback() {
    let selected = this.refs.addench.value
    if (selected in this.state.ench) {
      return
    }
    let newEnches = Object.assign({}, this.state.ench)
    newEnches[selected] = 0
    this.setState({ ench: newEnches })
  }

  enchantSetNumCallback(e) {
    let count = e.target.value
    let countNum = Number(count)
    let cardNum = e.target.name

    let newEnches = Object.assign({}, this.state.ench)

    if (countNum > 0) {
      newEnches[cardNum] = countNum
    } else {
      if (count === '') {
        newEnches[cardNum] = ''
      } else {
        delete newEnches[cardNum]
      }
    }

    this.setState({ ench: newEnches })
  }

  cleanseEnchants(newItem, newGear) {
    if (!newItem) {
      return {}
    }

    let newEnchants = {}
    Object.keys(this.state.ench).forEach(cardId => {
      if (
        enchantCardMatches(
          this.enchantItemDb.find(item => item.id === Number(cardId)),
          newItem,
          newGear
        )
      ) {
        newEnchants[cardId] = this.state.ench[cardId]
      }
    })
    return newEnchants
  }

  render() {
    if (!this.state.itemdb || !this.state.fixDb) {
      return <LoadBlock height="100px" />
    }

    const { gear, sWp, iPrf, iSuf, fixDb } = this.state

    // When selected item changes, recalculate fix db to unset no longer matching selections
    let prevItemKind
    if (this.selectedItem) {
      prevItemKind = this.selectedItem.kind
    }

    this.selectedItem = this.gearItemDb.find(item => item.id === Number(sWp))

    if (!this.selectedItem) {
      this.itemFixDb = []
    } else if (this.selectedItem.kind !== prevItemKind) {
      this.itemFixDb = fixDb.filter(fix => {
        return COMPARE_ITEMKIND(fix.ReqItemKind, this.selectedItem.kind)
      })
    }

    this.prefix = this.itemFixDb.find(fix => fix.id === Number(iPrf))
    this.suffix = this.itemFixDb.find(fix => fix.id === Number(iSuf))

    this.enchants = Object.keys(this.state.ench).map(cardId => {
      return {
        card: this.enchantItemDb.find(item => item.id === Number(cardId)),
        count: Number(this.state.ench[cardId])
      }
    })

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
                    this.setState({
                      gear: gearEach,
                      ench: this.cleanseEnchants(this.selectedItem, gearEach)
                    })
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
                  this.setState({
                    sWp: this.refs.weapsel.value,
                    ench: this.cleanseEnchants(
                      this.gearItemDb.find(
                        item => item.id === Number(this.refs.weapsel.value)
                      ),
                      gear
                    )
                  })}
                value={sWp || ''}
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
            <label className="label" htmlFor="iPrf">
              Prefix
            </label>
            <div className="select is-fullwidth">
              {this.renderFixSelect('iPrf', true)}
            </div>
          </div>

          <div className="column">
            <label className="label" htmlFor="iSuf">
              Suffix
            </label>
            <div className="select is-fullwidth">
              {this.renderFixSelect('iSuf', false)}
            </div>
          </div>
        </div>
        {this.selectedItem && (
          <div className="columns">
            <div className="column">
              <label className="label" htmlFor="addench">
                Add enchants
              </label>
              <div
                className="select is-fullwidth"
                style={{ marginBottom: '1em' }}
              >
                <select
                  id="addench"
                  ref="addench"
                  onChange={this.enchantAddCallback.bind(this)}
                  value={''}
                >
                  <option value="">Choose card</option>
                  {this.enchantItemDb
                    .filter(card =>
                      enchantCardMatches(card, this.selectedItem, gear)
                    )
                    .map(item => {
                      return (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      )
                    })}
                </select>
              </div>
              <div>
                {this.enchants.map(cardInfo => (
                  <div key={cardInfo.card.id}>
                    <input
                      min="0"
                      max="15"
                      name={cardInfo.card.id}
                      className="input is-small"
                      type="number"
                      value={cardInfo.count}
                      style={{ display: 'inline', width: '50px' }}
                      onChange={this.enchantSetNumCallback.bind(this)}
                    />
                    <label
                      className="label"
                      style={{
                        display: 'inline',
                        marginLeft: '0.5em',
                        lineHeight: '1.8'
                      }}
                    >
                      {cardInfo.card.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className="column">
              <WeaponPreview
                item={this.selectedItem}
                prefix={this.prefix}
                suffix={this.suffix}
                enchants={this.enchants}
              />
            </div>
          </div>
        )}
        <hr />
        TODO: Stats, Buffs/Items/Skills
      </div>
    )
  }
}

export default withRouter(WeaponCalcTool)
