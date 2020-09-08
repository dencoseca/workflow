import React from 'react'

function TaskDetails(props) {
  const createdAt = new Date(props.task.createdAt)

  return (
    <>
      <div className="task--value">{props.task.value}</div>
      <div className="task--created has-text-grey-light is-size-7 mr-3">{createdAt.toLocaleString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
    </>
  )
}

export default TaskDetails
