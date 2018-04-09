import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import MarkdownViewer from './MarkdownViewer'

import { queryData as queryCmsData } from '../containers/App'

class About extends PureComponent {
  static fetchData(store) {
    return queryCmsData(store.dispatch)
  }

  render() {
    const { content } = this.props

    return (
      <div>
        <Helmet>
          <meta
            name="description"
            content="About the Vi0lation guild and this website"
          />
          <title>About</title>
        </Helmet>

        <MarkdownViewer markdown={content} />
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    content: state.cms.contents.about
  }
}

export default connect(mapStateToProps)(About)
