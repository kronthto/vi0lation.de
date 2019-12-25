import React from 'react'
import aostats from 'aceonline-stats'
import { ITEMKIND_DEFENSE } from '../../../data/ao'
import {
  determinePrefix,
  getMergedDesBoni,
  PlusMinusNumber
} from './WeaponPreview'
import { colorName } from '../../../utils/AR/names'

// skill/other green
// todo: vs other gears

const WEAPON_ATTRS = ['_MIN', '_MAX', '_PROB', '_PIERCE']

const ARMOR_ATTRS = ['HP', 'DP', 'STD_DEF', 'ADV_DEF', 'STD_EVA', 'ADV_EVA']

const TotalResult = props => {
  const { item, weaponStats, gearStatPoints, skills } = props

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

  let skillsBonus = getMergedDesBoni(skills)

  return (
    <ul>
      {(weaponElseArmor ? WEAPON_ATTRS : ARMOR_ATTRS).map(attr => {
        if (attr.charAt(0) === '_') {
          if (!attrPrefix) {
            throw Error('Not a weapon item')
          }
          attr = attrPrefix + attr
        }
        return (
          <DisplayStat
            key={attr}
            attr={attr}
            value={weaponStats[attr]}
            statBonus={gearStatBonus[attr]}
            skillBonus={skillsBonus[attr]}
          />
        )
      })}
    </ul>
  )
}

const DisplayStat = props => {
  const { attr, value, statBonus, skillBonus } = props

  if (typeof value === 'undefined') {
    return null
  }

  let totalBonuses = (value.bonuses || 0) + (statBonus || 0) + (skillBonus || 0)
  let total

  if (value.additiv) {
    total = value.base + totalBonuses
  } else {
    total = value.base * (1 + totalBonuses)
  }

  return (
    <li>
      {attr}:{' '}
      {statBonus
        ? colorName(`\\d[${PlusMinusNumber(statBonus)}]\\d`)
        : null}{' '}
      {skillBonus
        ? colorName(`\\g[${PlusMinusNumber(skillBonus)}]\\g`)
        : null}{' '}
      = {total}
    </li>
  )
}

export default TotalResult
