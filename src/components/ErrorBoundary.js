import React, { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    console.log(error)
    // Update state so the next render will show the fallback UI.
    return { hasError: error }
  }

  render() {
    if (this.state.hasError) {
      const error = this.state.hasError
      // You can render any custom fallback UI
      return (
        <React.Fragment>
          <h1>Something went wrong.</h1>
          <p>Try reloading the page.</p>
          <hr />
          <h2>Error Details</h2>
          <code>
            {error.name}: {error.message}
          </code>
          <br />
          <code>{error.stack}</code>
        </React.Fragment>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
