import React, { Component } from 'react'

class Footer extends Component {
  shouldComponentUpdate() {
    return false
  }

  render() {
    return (
      <footer role="contentinfo" className="footer">
        <div className="container has-text-right">
          <a href="https://chromerivals.net">chromerivals.net</a>
        </div>
      </footer>
    )
  }
}

export default Footer
