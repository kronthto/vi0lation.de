import React, { Component } from 'react'

class Home extends Component {
  shouldComponentUpdate() {
    return false
  }

  render() {
    return (
      <div>
        <h1 className="title">OSR Tools</h1>

        <div className="columns is-multiline">

        </div>
      </div>
    )
  }
}

export default Home
