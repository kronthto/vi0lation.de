import React from 'react'

const colorMap = {
  e: '#F4AE0B',
  c: '#00CCCC',
  m: '#ff00ff',
  a: '#A8A8FF',
  h: '#ff8811',
  k: '#aa4400',
  u: '#aa33ff',
  v: '#007300',
  b: '#2255ff',
  d: '#777777',
  y: '#C2C200',
  l: '#00aaff',
  g: '#00ff00',
  q: '#bababa',
  o: '#77bb22',
  r: '#ff0000'
}

function specialNames(name) {
  let regex = name.match(/^(.*)4K(.*)$/)
  if (!regex) {
    return name
  }
  return (
    <span>
      {regex[1]}
      <i style={{ color: 'red' }}>4K</i>
      {regex[2]}
    </span>
  )
}

export function colorName(name) {
  // wenn hier zahl kommt
  let regex = name.match(/^\\([a-z])(.+)\\([a-z])$/)
  if (!regex || regex[1] !== regex[3]) {
    // opening/closing color differ?
    return specialNames(name)
  }
  let color = colorMap[regex[1]]
  if (!color) {
    return specialNames(name)
  }
  name = specialNames(regex[2])

  return <span style={{ color }}>{name}</span>
}
