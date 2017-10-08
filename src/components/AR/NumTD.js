import React from 'react'

export default props => {
  let { num } = props
  return (
    <td className="has-text-right">
      {typeof num === 'number' ? num.toLocaleString() : '-'}
    </td>
  )
}
