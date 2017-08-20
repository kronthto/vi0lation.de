import React, { Component } from 'react'
import NumTD from './NumTD'

import level2ep from '../../data/level2ep'

const TableLegend = () =>
  <tr>
    <th scope="col">Level</th>
    <th className="has-text-right" scope="col">
      Needed EP
    </th>
    <th className="has-text-right" scope="col">
      From previous
    </th>
  </tr>

class EPListTable extends Component {
  shouldComponentUpdate() {
    return false
  }

  render() {
    return (
      <table className="table is-striped">
        <thead>
          <TableLegend />
        </thead>
        <tbody>
          {Object.keys(level2ep).map(level => {
            let levelEp = level2ep[level]
            let previousEp = level2ep[level - 1]

            return (
              <tr key={level}>
                <th scope="row">
                  {level}
                </th>
                <NumTD num={levelEp} />
                <NumTD
                  num={
                    Number.isInteger(previousEp) ? levelEp - previousEp : '-'
                  }
                />
              </tr>
            )
          })}
        </tbody>
        <tfoot>
          <TableLegend />
        </tfoot>
      </table>
    )
  }
}

export default EPListTable
