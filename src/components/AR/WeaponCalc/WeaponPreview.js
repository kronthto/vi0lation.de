import React from 'react'
import { colorName } from '../../../utils/AR/names'
import {
  baseValuesToDesKeyMap,
  desKeyByDesNum,
  IS_PRIMARY_WEAPON,
  IS_SECONDARY_WEAPON,
  ITEMKIND_DEFENSE
} from '../../../data/ao'

const WeaponPreview = props => {
  const { item, prefix, suffix, enchants } = props
  let stats = mergeStats(collectStats(item, prefix, suffix, enchants))
  return (
    <div className="card">
      <header className="card-header">
        <p className="card-header-title is-centered">
          {prefix && colorName(prefix.name)}
          &nbsp;{colorName(item.name)}&nbsp;{colorName(
            `\\e[E${enchants.reduce((acc, card) => acc + card.count, 0)}]\\e`
          )}&nbsp;
          {suffix && colorName(suffix.name)}
        </p>
      </header>
      <div className="card-content">
        <div className="content">
          <ul>
            {Object.keys(stats).map(attr => (
              <DisplayStat key={attr} attr={attr} value={stats[attr]} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

const DisplayStat = props => {
  const { attr, value } = props

  if (!(value.base || value.enchants || value.fixes)) {
    return null
  }

  let baseIsPercentPoints = true
  let upgradesArePercentPoints = true
  let factorBaseBy = 1
  let calcTotal = true

  if (attr.includes('_RA')) {
    factorBaseBy = 1000
    baseIsPercentPoints = false
  }
  if (attr.includes('_MIN') || attr.includes('_MAX')) {
    calcTotal = false
    baseIsPercentPoints = false
  }
  if (attr === 'HP' || attr === 'DP') {
    baseIsPercentPoints = false
    upgradesArePercentPoints = false
  }
  if (attr.includes('WEIGHT')) {
    baseIsPercentPoints = false
  }

  let base = (Number(value.base) || 0) / factorBaseBy

  let total = null
  if (calcTotal) {
    let bonuses = (value.enchants || 0) + (value.fixes || null)
    if (!upgradesArePercentPoints || baseIsPercentPoints) {
      total = base + bonuses
    } else {
      // Weight/MM/RA
      total = base * (1 + bonuses)
    }
  }

  return (
    <li>
      {attr}: {base || null}{' '}
      {value.fixes
        ? colorName(`\\g[${PlusMinusNumber(value.fixes)}]\\g`)
        : null}{' '}
      {value.enchants
        ? colorName(`\\e[${PlusMinusNumber(value.enchants)}]\\e`)
        : null}{' '}
      {total !== null && (value.fixes || value.enchants) && ` = ${total}`}
    </li>
  )
}

const PlusMinusNumber = num => {
  num = Number(num)
  if (num <= 0) {
    return num
  }
  return '+' + num
}

const determinePrefix = item => {
  if (IS_PRIMARY_WEAPON(item.kind)) {
    return 'STD'
  }
  if (IS_SECONDARY_WEAPON(item.kind)) {
    return 'ADV'
  }
  if (item.kind === ITEMKIND_DEFENSE) {
    return null
  }
  throw Error('Unexpected itemkind')
}

const collectStats = (item, prefix, suffix, enchants) => {
  let values = {}

  let desKeyPrefix = determinePrefix(item)

  Object.keys(baseValuesToDesKeyMap).forEach(prop => {
    if (item[prop]) {
      let desKey = baseValuesToDesKeyMap[prop]
      if (
        !desKeyPrefix &&
        desKey === '_WEIGHT' &&
        item.kind === ITEMKIND_DEFENSE
      ) {
        desKey = 'WEIGHT'
      }
      if (desKey.charAt(0) === '_') {
        if (!desKeyPrefix) {
          throw Error('Not a weapon item')
        }
        desKey = desKeyPrefix + desKey
      }
      values[desKey] = item[prop]
    }
  })
  Object.keys(item.DesParameters).forEach(desNum => {
    desNum = Number(desNum)
    let desKey = desKeyByDesNum(desNum)
    if (!desKey) {
      console.warn(`DesNum ${desNum} not mapped`)
      return
    }

    if (!(desKey in values)) {
      values[desKey] = 0
    }

    values[desKey] += item.DesParameters[desNum]
  })

  // TODO: Speed

  return {
    base: values,
    fixes: getFixesStats([prefix, suffix].filter(Boolean)),
    enchants: getEnchantsStats(enchants)
  }
}

const getFixesStats = fixes => {
  let res = {}
  fixes.forEach(fix => {
    for (let i = 1; i <= 9; i++) {
      let desNum = fix[`DesParameter${i}`]
      if (!desNum) {
        continue
      }

      let desKey = desKeyByDesNum(desNum)
      if (!desKey) {
        console.warn(`DesNum ${desNum} not mapped`)
        continue
      }

      if (!(desKey in res)) {
        res[desKey] = 0
      }

      res[desKey] += fix[`ParameterValue${i}`]
    }
  })
  return res
}

const getEnchantsStats = enchants => {
  let values = {}
  enchants.forEach(enchInfo => {
    Object.keys(enchInfo.card.DesParameters).forEach(desNum => {
      desNum = Number(desNum)
      let desKey = desKeyByDesNum(desNum)
      if (!desKey) {
        console.warn(`DesNum ${desNum} not mapped`)
        return
      }

      if (!(desKey in values)) {
        values[desKey] = 0
      }

      values[desKey] += enchInfo.card.DesParameters[desNum] * enchInfo.count
    })
  })
  return values
}

const mergeStats = stats => {
  let res = {}
  Object.keys(stats).forEach(key => {
    Object.keys(stats[key]).forEach(desKey => {
      if (!(desKey in res)) {
        res[desKey] = {}
      }
      res[desKey][key] = stats[key][desKey]
    })
  })
  return res
}

export default WeaponPreview
