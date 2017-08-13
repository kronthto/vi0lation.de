import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class Footer extends Component {
  shouldComponentUpdate() {
    return false
  }

  render() {
    return (
      <footer role="contentinfo" className="footer">
        <div className="container has-text-right">
          <Link to="/about">About</Link>
          &nbsp;•&nbsp;
          <Link to="/contact">Contact</Link>
          <img
            src="//cdn.vi0lation.de/img/viologo.png"
            width="36"
            height="18"
            alt="Vi0 Logo"
            title="Vi0 Logo"
            style={{ marginLeft: '20px' }}
          />
        </div>
      </footer>
    )
  }
}

export default Footer
