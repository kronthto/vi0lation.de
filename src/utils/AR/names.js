import React from 'react'

const colorMap = {
  e: '#F5B930',
  c: '#00FFFF'
}

function specialNames(name) {
  switch (name) {
    case 'LUD4K':
      return (
        <span>
          LUD<i style={{ color: 'red' }}>4K</i>
        </span>
      )
    default:
      return name
  }
}

export function colorName(name) {
  let regex = name.match(/^\\([a-z])(.*)\\[a-z]$/)
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
