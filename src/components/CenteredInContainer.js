import React from 'react'

function CenteredInContainer(props) {
  const style = {
    minHeight: props.minHeight || null,
    minWidth: props.minWidth || null
  }

  return (
    <div className="centered-in-container" style={style}>
      {props.children}
    </div>
  )
}

export default CenteredInContainer
