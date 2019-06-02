import React from 'react'

const colorMap = {
  e: '#F5B930',
  c: '#00FFFF'
}

function specialNames(name) {
  let regex = name.match(/^(.+)4K$/)
  if (!regex) {
    return name
  }
  return (
    <span>
      {regex[1]}
      <i style={{ color: 'red' }}>4K</i>
    </span>
  )
}

export function colorName(name) {
  let regex = name.match(/^\\([a-z])(.+)\\[a-z]$/)
  if (!regex) {
    return specialNames(name)
  }
  let color = colorMap[regex[1]]
  if (!color) {
    return specialNames(name)
  }
  name = specialNames(regex[2])

  return <span style={{ color }}>{name}</span>
}
