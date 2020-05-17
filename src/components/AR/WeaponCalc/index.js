import React, { Component } from 'react'
import withRouter from 'react-router/withRouter'
import { callApiChecked } from '../../../middleware/api'
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
  DES_ENCHANT_INITIALIZE,
  ITEMKIND_ACCESSORY_TIMELIMIT,
  ITEMKIND_CARD
} from '../../../data/ao'
import LoadBlock from '../../LoadBlock'
import WeaponPreview, {
  addDesParamsArrayToFixes,
  prepareStats
} from './WeaponPreview'
import TotalResult from './TotalResult'
import { colorName } from '../../../utils/AR/names'

const eqKinds = [ITEMKIND_DEFENSE].concat(standardWeapons, advWeapons)
const isEquip = item => eqKinds.indexOf(item.kind) !== -1

const bannedEnchantNames = ['Swift ', '%]', 'E10', 'FFA', 'Platinum Guard']
const isBannedEnchant = item =>
  bannedEnchantNames.some(
    bannedName =>
      item.name.includes(bannedName) ||
      DES_ENCHANT_INITIALIZE in item.DesParameters
  )

const bannedCharmDes = [162, 159, 160, 129, 130, 158, 157] // 161 (Blue Saph) would also remove Hax-Charm
const isBannedCharm = item =>
  bannedCharmDes.some(bannedDesNum => bannedDesNum in item.DesParameters)

const BUFF_CARD_ITEMS = [7026601, 7026571, 7020641, 7020651, 7001100]

const hasNonArmorDesParams = item => {
  let desParams = Object.assign({}, item.DesParameters)

  delete desParams[13]
  delete desParams[89]
  delete desParams[22]
  delete desParams[23]
  delete desParams[24]
  delete desParams[25]

  return Object.keys(desParams).length > 0
}

const stats = [
  { id: 'Atk', label: 'Attack' },
  { id: 'Def', label: 'Defense' },
  { id: 'Eva', label: 'Evasion' }
]

// noinspection JSBitwiseOperatorUsage
const enchantCardMatches = (card, item, gear) =>
  COMPARE_ITEMKIND(card.ReqItemKind, item.kind) &&
  card.ReqUnitKind & unitKinds[gear]

let instance

export const resetCurrentInstance = () => {
  if (instance) {
    instance.reset()
  }
}

class WeaponCalcTool extends Component {
  initState

  gearItemDb = []
  gearArmorsWithBonus = []
  gearSkillDb = []
  itemFixDb = []
  armorFixDb = []
  enchantItemDb = []
  buffItemDb = []
  charmDb = []
  selectedItem
  prefix
  suffix
  enchants

  reset() {
    this.setState(
      Object.assign(
        {
          arm: undefined,
          ch: undefined,
          sWp: undefined,
          iPrf: undefined,
          iSuf: undefined,
          aPrf: undefined,
          aSuf: undefined
        },
        this.initState,
        { gear: this.state.gear, sk: [], bc: [] }
      )
    )
  }

  constructor(props) {
    super(props)

    let defaultStat = {}
    stats.forEach(stat => (defaultStat[stat.id] = 0))

    this.initState = {
      gear: 'B',
      ench: {},
      stat: defaultStat,
      sk: [],
      bc: []
    }
    let initStateWithFrag = Object.assign({}, this.initState)

    let hash = this.props.location.hash.substr(1)
    if (hash) {
      Object.assign(initStateWithFrag, JSON.parse(atob(hash)))
    }

    this.state = initStateWithFrag

    instance = this
  }

  componentWillUnmount() {
    instance = null
  }

  filterItemDbs(itemdb, gear) {
    // noinspection JSBitwiseOperatorUsage
    let itemDbGear = itemdb.filter(
      item =>
        item.ReqUnitKind & unitKinds[gear] ||
        (item.kind >= 50 && item.SkillTargetType === 2 && item.Range)
    ) // Matches Gear or is a skill that applies to form (Type&Range) (Ragings)
    this.gearItemDb = itemDbGear.filter(isEquip)
    this.gearArmorsWithBonus = this.gearItemDb.filter(
      item => item.kind === ITEMKIND_DEFENSE && hasNonArmorDesParams(item)
    )
    this.gearSkillDb = itemDbGear.filter(
      item =>
        (item.kind === ITEMKIND_SKILL_ATTACK ||
          item.kind === ITEMKIND_SKILL_DEFENSE) &&
        item.name.indexOf('\\c') === 0
    )
  }

  componentDidMount() {
    callApiChecked(
      config.apibase + 'chromerivals/omi?category=item'
    ).then(allItems => {
      let reducedItemDb = Object.values(allItems)
        .filter(item => {
          const { kind, ReqMinLevel, name } = item
          if (
            kind === ITEMKIND_SKILL_ATTACK ||
            kind === ITEMKIND_SKILL_DEFENSE ||
            kind === ITEMKIND_ENCHANT ||
            kind === ITEMKIND_ACCESSORY_TIMELIMIT ||
            kind === ITEMKIND_CARD
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
      this.buffItemDb = reducedItemDb.filter(
        item => BUFF_CARD_ITEMS.indexOf(item.id) !== -1
      )
      this.buffItemDb.push({
        id: 'PET10',
        name: 'PET-Fixes +10% Dmg',
        DesParameters: {
          '18': 0.1,
          '19': 0.1,
          '71': 0.1,
          '72': 0.1
        }
      })
      this.charmDb = reducedItemDb.filter(
        item =>
          item.kind === ITEMKIND_ACCESSORY_TIMELIMIT &&
          item.Time === 18000000 &&
          item.name.indexOf('(5H)') !== -1 &&
          !isBannedCharm(item) &&
          item.name.indexOf('Holy') === -1
      )
      this.setState({ itemdb: reducedItemDb })
    })
    callApiChecked(
      config.apibase + 'chromerivals/omi?category=rareitems'
    ).then(allFixes => {
      let fixDb = Object.values(allFixes)
        .filter(
          fix =>
            fix.probability !== 0 &&
            ['m', 'c', 'r', 'l', 'y'].indexOf(fix.name.charAt(1)) !== -1
        )
        .sort((a, b) => a.probability - b.probability)
      this.armorFixDb = addDesParamsArrayToFixes(
        fixDb.filter(fix => {
          return COMPARE_ITEMKIND(fix.ReqItemKind, ITEMKIND_DEFENSE)
        })
      )
      this.setState({ fixDb })
    })
  }

  componentDidUpdate(prevProps, prevState) {
    const serializedState = this.serializeState()
    this.props.history.replace({
      hash: Object.keys(serializedState).length
        ? btoa(JSON.stringify(this.serializeState()))
        : null
    })
  }

  serializeState() {
    let obj = Object.assign({}, this.state)
    delete obj.itemdb
    delete obj.fixDb

    Object.keys(obj).forEach(stateKey => {
      const stateKeyVal = obj[stateKey]
      if (
        !stateKeyVal ||
        (Array.isArray(stateKeyVal) && stateKeyVal.length === 0) ||
        (typeof stateKeyVal === 'object' &&
          Object.values(stateKeyVal).filter(Boolean).length === 0)
      ) {
        delete obj[stateKey]
      }
    })
    if (Object.keys(obj).length === 1 && 'gear' in obj) {
      delete obj.gear
    }

    return obj
  }

  renderFixSelect(saveAs, prefix, fixDb) {
    const def = this.state[saveAs]
    return (
      <select
        id={saveAs}
        ref={saveAs}
        onChange={() => this.setState({ [saveAs]: this.refs[saveAs].value })}
        value={def || ''}
      >
        <option value="">-</option>
        {(fixDb || this.itemFixDb)
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

    const weaponStats = this.selectedItem
      ? prepareStats(this.selectedItem, this.prefix, this.suffix, this.enchants)
      : undefined

    const isArmor =
      this.selectedItem &&
      COMPARE_ITEMKIND(ITEMKIND_DEFENSE, this.selectedItem.kind)

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
                      ench: this.cleanseEnchants(this.selectedItem, gearEach),
                      sk: []
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
                onChange={() => {
                  let newItem = this.gearItemDb.find(
                    item => item.id === Number(this.refs.weapsel.value)
                  )
                  let stateUpdate = {
                    sWp: this.refs.weapsel.value,
                    ench: this.cleanseEnchants(newItem, gear)
                  }
                  if (stateUpdate.sWp && !isNaN(stateUpdate.sWp)) {
                    stateUpdate.sWp = Number(stateUpdate.sWp)
                  }

                  if (newItem && this.selectedItem) {
                    // oof
                    if (COMPARE_ITEMKIND(ITEMKIND_DEFENSE, newItem.kind)) {
                      // Switched to armor
                      //console.log(this.state, "toArmor");
                      if (this.state.aPrf) {
                        stateUpdate['iPrf'] = this.state.aPrf
                      }
                      if (this.state.aSuf) {
                        stateUpdate['iSuf'] = this.state.aSuf
                      }
                      stateUpdate['aPrf'] = null
                      stateUpdate['aSuf'] = null
                    } else {
                      if (
                        COMPARE_ITEMKIND(
                          ITEMKIND_DEFENSE,
                          this.selectedItem.kind
                        )
                      ) {
                        // switched from armor to weapon
                        // console.log(this.state, "toWeap");
                        if (this.state.iPrf) {
                          stateUpdate['aPrf'] = this.state.iPrf
                        }
                        if (this.state.iSuf) {
                          stateUpdate['aSuf'] = this.state.iSuf
                        }
                        stateUpdate['iPrf'] = null
                        stateUpdate['iSuf'] = null
                      }
                    }
                  }

                  this.setState(stateUpdate)
                }}
                value={sWp || ''}
              >
                <option value="">Select item ...</option>
                {this.gearItemDb.map(item => {
                  return (
                    <option key={item.id} value={item.id}>
                      {item.name} [{item.ReqMinLevel}]
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
        {!isArmor && (
          <div className="columns">
            <div className="column">
              <label className="label" htmlFor="aPrf">
                Armor-Prefix
              </label>
              <div className="select is-fullwidth">
                {this.renderFixSelect('aPrf', true, this.armorFixDb)}
              </div>
            </div>

            <div className="column">
              <label className="label" htmlFor="aSuf">
                Armor-Suffix
              </label>
              <div className="select is-fullwidth">
                {this.renderFixSelect('aSuf', false, this.armorFixDb)}
              </div>
            </div>
          </div>
        )}
        {this.selectedItem && (
          <div className="columns">
            <div className="column">
              {!isArmor && (
                <React.Fragment>
                  <label className="label" htmlFor="armorsel">
                    Armor-Bonus
                  </label>
                  <div
                    className="select is-fullwidth"
                    style={{ marginBottom: 'calc(1.5rem - 0.75rem)' }}
                  >
                    <select
                      id="armorsel"
                      onChange={e => {
                        let newArmorId = Number(e.target.value)
                        if (!newArmorId) {
                          newArmorId = null
                        }

                        this.setState({ arm: newArmorId })
                      }}
                      value={this.state.arm || ''}
                    >
                      <option value="">- None -</option>
                      {this.gearArmorsWithBonus.map(item => {
                        return (
                          <option key={item.id} value={item.id}>
                            {item.name} [{item.ReqMinLevel}]
                          </option>
                        )
                      })}
                    </select>
                  </div>
                </React.Fragment>
              )}

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
                stats={weaponStats}
              />
            </div>
          </div>
        )}
        <hr />
        <label className="label">
          Stats{' '}
          <a
            target="_blank"
            href="https://beta.vi0lation.de/ranking/statcalc"
            rel="noopener noreferrer"
          >
            &rarr; StatCalc
          </a>
        </label>
        <div className="columns">
          {stats.map(stat => {
            const id = 'stat' + stat.id
            return (
              <div className="column" key={id}>
                <label className="label" htmlFor={id}>
                  {stat.label}
                </label>
                <input
                  type="number"
                  value={this.state.stat[stat.id]}
                  className="input"
                  id={id}
                  min="0"
                  max="340"
                  onChange={e =>
                    this.setState({
                      stat: Object.assign({}, this.state.stat, {
                        [stat.id]: Number(e.target.value)
                      })
                    })}
                />
              </div>
            )
          })}
        </div>
        <label className="label">Skills/Buffs & Consumables</label>
        <div className="tags">
          {this.gearSkillDb.map(skill => (
            <span
              style={{ cursor: 'pointer' }}
              className={
                'tag' +
                (this.state.sk.indexOf(skill.id) !== -1 ? ' is-activated' : '')
              }
              key={skill.id}
              onClick={() => this.handleSkillClick(skill)}
            >
              {colorName(skill.name)}
            </span>
          ))}
        </div>
        <div className="tags">
          {this.buffItemDb.map(buff => (
            <span
              style={{ cursor: 'pointer' }}
              className={
                'tag' +
                (this.state.bc.indexOf(buff.id) !== -1 ? ' is-activated' : '')
              }
              key={buff.id}
              onClick={() => this.handleBuffcardClick(buff)}
            >
              {colorName(buff.name)}
            </span>
          ))}
        </div>
        <div className="columns">
          <div className="column">
            <label className="label" htmlFor="charmsel">
              Charm
            </label>
            <div className="select is-fullwidth">
              <select
                id="charmsel"
                onChange={e => {
                  let newCharmId = Number(e.target.value)
                  if (!newCharmId) {
                    newCharmId = null
                  }

                  this.setState({ ch: newCharmId })
                }}
                value={this.state.ch || ''}
              >
                <option value="">- None -</option>
                {this.charmDb.map(item => {
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
        <hr />
        {this.selectedItem && (
          <TotalResult
            item={this.selectedItem}
            weaponStats={weaponStats}
            gearStatPoints={this.state.stat}
            skills={this.state.sk
              .map(skillId =>
                this.gearSkillDb.find(skill => skill.id === skillId)
              )
              .concat(
                this.state.bc.map(buffId =>
                  this.buffItemDb.find(skill => skill.id === buffId)
                )
              )}
            charm={this.charmDb.find(
              charmItem => charmItem.id === this.state.ch
            )}
            armorBonus={
              isArmor
                ? []
                : [this.state.aPrf, this.state.aSuf]
                    .map(fixId =>
                      this.armorFixDb.find(fix => fix.id === Number(fixId))
                    )
                    .concat([
                      this.gearArmorsWithBonus.find(
                        item => item.id === this.state.arm
                      )
                    ])
            }
          />
        )}
      </div>
    )
  }

  handleSkillClick(skill) {
    let skillState = this.state.sk

    if (skillState.indexOf(skill.id) === -1) {
      skillState.push(skill.id)
    } else {
      skillState = skillState.filter(skillId => skillId !== skill.id)
    }

    this.setState({ sk: skillState })
  }

  handleBuffcardClick(skill) {
    let buffCardState = this.state.bc

    if (buffCardState.indexOf(skill.id) === -1) {
      buffCardState.push(skill.id)
    } else {
      buffCardState = buffCardState.filter(skillId => skillId !== skill.id)
    }

    this.setState({ bc: buffCardState })
  }
}

export default withRouter(WeaponCalcTool)
