import React from 'react'

function FlashMessages(props) {
  return (
    <div className="floating-alerts">
      {props.messages.map((msg, index) => {
        return (
          <div key={index} className={`notification is-${msg.color} is-light has-text-centered floating-alert`}>
            {msg.value}
          </div>
        )
      })}
    </div>
  )
}

export default FlashMessages
