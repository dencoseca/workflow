import React from 'react'

function Task(props) {
  const createdAt = new Date(props.task.createdAt)
  let categoryColor = ''
  let statusColor = ''

  switch (props.task.category) {
    case 'Setup':
      categoryColor = 'link'
      break
    case 'Design':
      categoryColor = 'warning'
      break
    case 'Content':
      categoryColor = 'light'
      break
    case 'Functionality':
      categoryColor = 'danger'
      break
    default:
      categoryColor = ''
  }

  switch (props.task.status) {
    case 'Planning':
      statusColor = 'link'
      break
    case 'Implementing':
      statusColor = 'warning'
      break
    case 'Reviewing':
      statusColor = 'danger'
      break
    case 'Complete':
      statusColor = 'success'
      break
    default:
      statusColor = ''
  }

  return (
    <div className="task" key={props.task._id}>
      <div className="task--value">{props.task.value}</div>
      <div className="task--created has-text-grey-light is-size-7 mr-3">
        {createdAt.toLocaleString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      </div>
      <div className={`task--category button is-static is-small is-light is-${categoryColor} mr-3`}>{props.task.category}</div>
      <div className={`task--status button is-static is-small is-light is-${statusColor} mr-3`}>{props.task.status}</div>
      <span className="task--delete has-text-danger">
        <i onClick={e => props.handleDeleteTaskClick(e)} data-task={props.task._id} className="fa fa-times"></i>
      </span>
    </div>
  )
}

export default Task
