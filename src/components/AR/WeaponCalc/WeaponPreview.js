import React from 'react'
import { colorName } from '../../../utils/AR/names'

const WeaponPreview = props => {
  const { item, prefix, suffix } = props
  let stats = visualizeStats(item)
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
              <li key={attr}>{`${attr}: ${stats[attr]}`}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

const visualizeStats = item => {
  let stats = {
    'Attack Power': item.AbilityMin + ' ~ ' + item.AbilityMax,
    Accuracy: item.HitRate,
    Pierce: item.FractionResistance,
    Range: item.Range,
    'Reattack Time': item.ReAttacktime / 1000,
    // TODO: Speed
    Weight: item.Weight
  }
  return stats
}

export default WeaponPreview
