import React from 'react'
import LoadSpinner from './LoadSpinner'

const styles = {
  width: '100%',
  display: 'flex',
  justifyContent: 'center'
}

const LoadBlock = props => (
  <div style={Object.assign({ height: props.height }, styles)}>
    <LoadSpinner style={{ alignSelf: 'center' }} />
  </div>
)

export default LoadBlock
