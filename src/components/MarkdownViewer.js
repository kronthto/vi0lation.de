import React, { PureComponent } from 'react'
import marked from 'marked'

class MarkdownViewer extends PureComponent {
  render() {
    const md = this.props.markdown
    if (!md) {
      return null
    }

    // TODO: How to handle internal links? Prevent page reload ...
    return <div dangerouslySetInnerHTML={{ __html: marked(md) }} />
  }
}

export default MarkdownViewer
