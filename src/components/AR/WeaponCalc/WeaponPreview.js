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
  const { item, prefix, suffix } = props
  let stats = mergeStats(collectStats(item))
  return (
    <div className="card">
      <header className="card-header">
        <p className="card-header-title is-centered">
          {prefix && colorName(prefix.name)}
          &nbsp;{colorName(item.name)}&nbsp;
          {suffix && colorName(suffix.name)}
        </p>
      </header>
      <div className="card-content">
        <div className="content">
          <ul>
            {Object.keys(stats).map(attr => (
              <li key={attr}>{`${attr}: ${JSON.stringify(stats[attr])}`}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
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

const collectStats = item => {
  let values = {}

  let desKeyPrefix = determinePrefix(item)

  Object.keys(baseValuesToDesKeyMap).forEach(prop => {
    if (item[prop]) {
      let desKey = baseValuesToDesKeyMap[prop]
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

  // TODO: Speed, Weight

  return {
    base: values,
    fixes: {}, // TODO
    enchants: {} // TODO
  }
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
