import React from 'react'

function TaskDetails(props) {
  const createdAt = new Date(props.task.createdAt)

  return (
    <div className="task mt-1" key={props.task._id}>
      <div className="task--value">{props.task.value}</div>
      {props.task.categories && <div className="task--status">{props.task.status}</div>}
      <div className="task--created has-text-grey-light is-size-7 mr-3">{createdAt.toLocaleString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
      <span className="task--delete has-text-danger">
        <i onClick={e => props.handleDeleteTaskClick(e)} data-task={props.task._id} className="fa fa-trash"></i>
      </span>
    </div>
  )
}

export default TaskDetails
