import React from 'react'

function Task(props) {
  const createdAt = new Date(props.task.createdAt)
  
  return (
    <div className="task mt-1" key={props.task._id}>
      <div className="task--value">{props.task.value}</div>
      <div className="task--created has-text-grey-light is-size-7">{createdAt.toLocaleString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
    </div>
  )
}

export default Task
