import React from 'react'
import { colorName } from '../../../utils/AR/names'
import {
  baseValuesToDesKeyMap,
  desKeyByDesNum,
  IS_PRIMARY_WEAPON,
  IS_SECONDARY_WEAPON,
  ITEMKIND_DEFENSE
} from '../../../data/ao'

export const prepareStats = (item, prefix, suffix, enchants) => {
  let stats = mergeStats(collectStats(item, prefix, suffix, enchants))
  let displayStats = {}

  Object.keys(stats).forEach(attr => {
    let value = Object.assign({}, stats[attr])

    if (!(value.base || value.enchants || value.fixes)) {
      return
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

    let bonuses = (value.enchants || 0) + (value.fixes || null)
    value.additiv = !upgradesArePercentPoints || baseIsPercentPoints
    if (calcTotal) {
      if (value.additiv) {
        value.total = base + bonuses
      } else {
        // Weight/MM/RA
        value.total = base * (1 + bonuses)
      }
    }

    value.base = base
    value.bonuses = bonuses

    displayStats[attr] = value
  })

  return displayStats
}

const WeaponPreview = props => {
  const { item, prefix, suffix, enchants, stats } = props

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

  return (
    <li>
      {attr}: {value.base || null}{' '}
      {value.fixes
        ? colorName(`\\g[${PlusMinusNumber(value.fixes)}]\\g`)
        : null}{' '}
      {value.enchants
        ? colorName(`\\e[${PlusMinusNumber(value.enchants)}]\\e`)
        : null}{' '}
      {'total' in value &&
        (value.fixes || value.enchants) &&
        ` = ${value.total}`}
    </li>
  )
}

export const PlusMinusNumber = num => {
  num = Number(num)
  if (num <= 0) {
    return num
  }
  return '+' + num
}

export const determinePrefix = item => {
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
  values = mergeAndSum(values, getBonusValuesFromDesParams(item.DesParameters))

  // TODO: Speed

  return {
    base: values,
    fixes: getFixesStats([prefix, suffix].filter(Boolean)),
    enchants: getEnchantsStats(enchants)
  }
}

const transformDesAttrsToArray = item => {
  let desResult = {}
  for (let i = 1; i <= 9; i++) {
    let desNum = item[`DesParameter${i}`]
    if (!desNum) {
      continue
    }
    desResult[desNum] = item[`ParameterValue${i}`]
  }
  return desResult
}

const getFixesStats = fixes =>
  getMergedDesBoni(
    fixes.map(fix => {
      fix.DesParameters = transformDesAttrsToArray(fix)
      return fix
    })
  )

export const mergeAndSum = (o1, o2) => {
  // is there a core-func for this?
  Object.keys(o2).forEach(key => {
    if (key in o1) {
      o1[key] += o2[key]
    } else {
      o1[key] = o2[key]
    }
  })
  return o1
}
export const getBonusValuesFromDesParams = desParameters => {
  let values = {}
  Object.keys(desParameters).forEach(desNum => {
    desNum = Number(desNum)
    let desKey = desKeyByDesNum(desNum)
    if (!desKey) {
      console.warn(`DesNum ${desNum} not mapped`)
      return
    }

    if (!(desKey in values)) {
      values[desKey] = 0
    }

    values[desKey] += desParameters[desNum]
  })
  return values
}
export const getMergedDesBoni = thingsWithDesParams =>
  thingsWithDesParams.reduce(
    (acc, cur) =>
      mergeAndSum(acc, getBonusValuesFromDesParams(cur.DesParameters)),
    {}
  )

const getEnchantsStats = enchants =>
  enchants.reduce((acc, currentEnchantInfo) => {
    let enchantBonusValues = getBonusValuesFromDesParams(
      currentEnchantInfo.card.DesParameters
    )
    Object.keys(enchantBonusValues).forEach(key => {
      enchantBonusValues[key] =
        enchantBonusValues[key] * currentEnchantInfo.count
    })
    return mergeAndSum(acc, enchantBonusValues)
  }, {})

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
