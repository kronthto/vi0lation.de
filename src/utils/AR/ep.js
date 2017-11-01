import level2ep from '../../data/level2ep'

import number_format from 'locutus/php/strings/number_format'

const highestLv = Number(Object.keys(level2ep).pop())
const highestEp = level2ep[highestLv]

function procByEp(ep, level) {
  if (level === highestLv) {
    return '99.99'
  }
  let thislvlep = level2ep[level]
  let nextlvlep = level2ep[level + 1]
  return number_format((ep - thislvlep) / (nextlvlep - thislvlep) * 100, 2)
}

function levelByEp(ep) {
  if (ep === highestEp) {
    return highestLv
  }

  return Object.keys(level2ep).find(level => level2ep[level] > ep) - 1
}

export function calcProgessBarByEp(ep, level) {
  if (ep > highestEp) {
    return '> MaxLv'
  }
  if (typeof level === 'undefined') {
    level = levelByEp(ep)
  }
  let proc = procByEp(ep, level)
  return `Lv. ${level} ${proc}%`
}
