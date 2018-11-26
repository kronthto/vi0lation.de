import React from 'react'

const colorMap = {
  e: '#F5B930',
  c: '#00FFFF'
}

export function colorName(name) {
  let regex = name.match('^\\\\([a-z])(.*)\\\\[a-z]$')
  if (!regex) {
    return name
  }
  let color = colorMap[regex[1]]
  if (!color) {
    return name
  }
  return <span style={{ color }}>{regex[2]}</span>
}
