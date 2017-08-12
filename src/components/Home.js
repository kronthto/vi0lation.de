import React, { Component } from 'react'

class Home extends Component {
  shouldComponentUpdate(nextProps) {
    return false
  }

  render() {
    return (
      <div>
        <h1 className="title">Vi0</h1>
      </div>
    )
  }
}

export default Home
