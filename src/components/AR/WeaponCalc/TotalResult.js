import React, { Component } from 'react'
import aostats from 'aceonline-stats'
import aofb from 'aceonline-framebreak'
import { ITEMKIND_DEFENSE } from '../../../data/ao'
import {
  determinePrefix,
  getMergedDesBoni,
  isAttrAdditiv,
  PlusMinusNumber
} from './WeaponPreview'
import { colorName } from '../../../utils/AR/names'

// oneshot potential / % (oof, kits..)

const WEAPON_ATTRS = ['_MIN', '_MAX', '_PROB', '_PIERCE', '_SHOTS', '_MULTI']

const ARMOR_ATTRS = ['HP', 'DP', 'STD_DEF', 'ADV_DEF', 'STD_EVA', 'ADV_EVA']

class TotalResult extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    const {
      item,
      weaponStats,
      gearStatPoints,
      skills,
      charm,
      armorBonus
    } = this.props

    const weaponElseArmor = item.kind !== ITEMKIND_DEFENSE
    const attrPrefix = determinePrefix(item)

    let gearStatBonus = {}
    if (weaponElseArmor && gearStatPoints.Atk) {
      gearStatBonus[attrPrefix + '_PROB'] = aostats.prob(gearStatPoints.Atk)
      gearStatBonus[attrPrefix + '_PIERCE'] = Math.floor(
        aostats.pierce(gearStatPoints.Atk)
      )
      let mm = aostats.dmgInc(gearStatPoints.Atk)
      gearStatBonus[attrPrefix + '_MIN'] = mm
      gearStatBonus[attrPrefix + '_MAX'] = mm
    } else {
      if (gearStatPoints.Eva) {
        let eva = aostats.evasion(gearStatPoints.Eva)
        gearStatBonus['STD_EVA'] = eva
        gearStatBonus['ADV_EVA'] = eva
      }
      if (gearStatPoints.Def) {
        let def = aostats.defense(gearStatPoints.Def)
        gearStatBonus['STD_DEF'] = def
        gearStatBonus['ADV_DEF'] = def
      }
    }

    let greenAdditives = [].concat(skills)
    if (charm) {
      greenAdditives.push(charm)
    }
    armorBonus.forEach(armorFix => {
      if (armorFix) {
        greenAdditives.push(armorFix)
      }
    })
    let skillsBonus = getMergedDesBoni(greenAdditives)

    const totalValues = calcTotalValues(
      weaponElseArmor,
      attrPrefix,
      weaponStats,
      gearStatBonus,
      skillsBonus
    )

    let stdDps = null
    if (attrPrefix === 'STD') {
      const fbRes = aofb(
        weaponStats.STD_RA.base,
        totalValues.STD_SHOTS.total,
        60,
        weaponStats.STD_RA.bonuses * -100 + 1
      )
      const bps = fbRes[fbRes.length - 1].bps * totalValues.STD_MULTI.total
      stdDps = (
        <li>
          DPS <abbr title={`${fbRes[fbRes.length - 1].rea}ra BP`}>@60fps</abbr>:{' '}
          {(bps * totalValues.STD_MIN.total).toFixed(3)} ~{' '}
          {(bps * totalValues.STD_MAX.total).toFixed(3)}
        </li>
      )
    }

    return (
      <section>
        <ul>
          {Object.keys(totalValues).map(attr => (
            <DisplayStat key={attr} attr={attr} {...totalValues[attr]} />
          ))}
          {stdDps}
          {attrPrefix === 'ADV' ? (
            <li>
              DMG/Volley:{' '}
              {(totalValues['ADV_MIN'].total *
                totalValues['ADV_SHOTS'].total *
                totalValues['ADV_MULTI'].total
              ).toFixed(3)}{' '}
              ~{' '}
              {(totalValues['ADV_MAX'].total *
                totalValues['ADV_SHOTS'].total *
                totalValues['ADV_MULTI'].total
              ).toFixed(3)}
            </li>
          ) : null}
        </ul>
        {weaponElseArmor ? (
          <React.Fragment>
            <label className="label">Enemy stats</label>
            <div className="columns">
              {['Def', 'Eva', 'HP', 'DP'].map(enemyStat => {
                const id = 'Enm_' + enemyStat
                return (
                  <div className="column" key={id}>
                    <label className="label" htmlFor={id}>
                      {enemyStat}
                    </label>
                    <input
                      type="number"
                      value={this.state[id] || ''}
                      className="input"
                      id={id}
                      step="0.01"
                      onChange={e =>
                        this.setState({
                          [id]: e.target.value.length
                            ? Number(e.target.value)
                            : null
                        })}
                    />
                  </div>
                )
              })}
            </div>
            {this.valuesVs(totalValues, attrPrefix)}
          </React.Fragment>
        ) : null}
      </section>
    )
  }

  valuesVs(totalValues, attrPrefix) {
    if (!Object.values(this.state).some(Boolean)) {
      return null
    }

    let hitRate, hitApplyDamage

    if (this.state.Enm_Eva) {
      hitRate = Math.max(
        0,
        Math.min(
          totalValues[attrPrefix + '_PROB'].total - this.state.Enm_Eva,
          100
        )
      )
    }

    if (this.state.Enm_Def) {
      hitApplyDamage =
        100 -
        Math.max(
          0,
          Math.min(
            this.state.Enm_Def - totalValues[attrPrefix + '_PIERCE'].total,
            100
          )
        )
    }

    let trueMin = totalValues[attrPrefix + '_MIN'].total
    let trueMax = totalValues[attrPrefix + '_MAX'].total
    if (typeof hitApplyDamage !== 'undefined') {
      let trueFraction = hitApplyDamage / 100
      trueMin = Math.max(1, trueMin * trueFraction)
      trueMax = Math.max(1, trueMax * trueFraction)
    }

    // TODO: Per S / Per Volley to func with MM params

    return (
      <ul>
        {typeof hitRate !== 'undefined' ? (
          <li>Hitrate: {hitRate.toFixed(0)}%</li>
        ) : null}
        {typeof hitApplyDamage !== 'undefined' ? (
          <li>Dmg% through Def: {hitApplyDamage.toFixed(2)}%</li>
        ) : null}
        <li>
          True MM / Hit: {trueMin.toFixed(6)} ~ {trueMax.toFixed(6)}
        </li>
      </ul>
    )
  } // refactor to class vars
}

const calcTotalValues = (
  weaponElseArmor,
  attrPrefix,
  weaponStats,
  gearStatBonus,
  skillsBonus
) => {
  let res = {}
  ;(weaponElseArmor ? WEAPON_ATTRS : ARMOR_ATTRS).forEach(attr => {
    if (attr.charAt(0) === '_') {
      if (!attrPrefix) {
        throw Error('Not a weapon item')
      }
      attr = attrPrefix + attr
    }

    const statBonus = gearStatBonus[attr]
    const skillBonus = skillsBonus[attr]
    let value = weaponStats[attr]

    if (typeof value === 'undefined') {
      value = {
        additiv: isAttrAdditiv(attr),
        base: 0
      }
    }

    let totalBonuses =
      (value.bonuses || 0) + (statBonus || 0) + (skillBonus || 0)
    let total

    if (value.additiv) {
      total = value.base + totalBonuses
    } else {
      total = value.base * (1 + totalBonuses)
    }

    res[attr] = {
      statBonus,
      skillBonus,
      total
    }
  })
  return res
}

const DisplayStat = props => (
  <li>
    {props.attr}:{' '}
    {props.statBonus
      ? colorName(`\\d[${PlusMinusNumber(props.statBonus)}]\\d`)
      : null}{' '}
    {typeof props.skillBonus !== 'undefined'
      ? colorName(`\\g[${PlusMinusNumber(props.skillBonus)}]\\g`)
      : null}{' '}
    = {Number(props.total.toFixed(6))}
  </li>
)

export default TotalResult
