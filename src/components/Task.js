import React, { useState, useContext } from 'react'
import TaskInlineForm from './TaskInlineForm'
import axios from 'axios'
import DispatchContext from '../DispatchContext'

function Task(props) {
  const appDispatch = useContext(DispatchContext)
  const [loadTaskInlineForm, setLoadTaskInlineForm] = useState(false)
  const [taskValue, setTaskValue] = useState(props.task.value)
  const [taskCategory, setTaskCategory] = useState(props.task.category)
  const [taskStatus, setTaskStatus] = useState(props.task.status)

  const lastUpdated = new Date(props.task.updatedAt)
  let categoryColor = ''
  let statusColor = ''

  switch (taskCategory) {
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

  switch (taskStatus) {
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

  function handleUpdateTaskClick(e) {
    e.preventDefault()
    const taskId = e.target.dataset.task
    const ourRequest = axios.CancelToken.source()

    async function updateTask() {
      try {
        const response = await axios.post(
          'http://localhost:8080/task/update',
          { taskId, task: { value: taskValue.trim(), category: taskCategory, status: taskStatus } },
          { cancelToken: ourRequest.token }
        )
        if (response.data.errorMessage) {
          appDispatch({ type: 'flashMessage', value: response.data.errorMessage, color: 'danger' })
        } else {
          appDispatch({ type: 'flashMessage', value: response.data.successMessage, color: 'success' })
          setTaskValue(response.data.updatedTask.value)
          setTaskCategory(response.data.updatedTask.category)
          setTaskStatus(response.data.updatedTask.status)
          setLoadTaskInlineForm(false)
        }
      } catch (err) {
        console.log('There was a problem or the request was cancelled.')
      }
    }
    updateTask()
    return () => {
      ourRequest.cancel()
    }
  }

  return (
    <>
      {loadTaskInlineForm ? (
        <TaskInlineForm
          taskId={props.task._id}
          inputPlaceholderText="Edit task description"
          submitButtonText="Update"
          taskValue={taskValue}
          setTaskValue={setTaskValue}
          taskCategory={taskCategory}
          setTaskCategory={setTaskCategory}
          taskStatus={taskStatus}
          setTaskStatus={setTaskStatus}
          submitTask={handleUpdateTaskClick}
        />
      ) : (
        <div className="task" key={props.task._id}>
          <div className="task--value">{taskValue}</div>
          <div className="task--created has-text-grey-light is-size-7 mr-3">
            {lastUpdated.toLocaleString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          <div className={`task--category button is-static is-small is-light is-${categoryColor} mr-3`}>{taskCategory}</div>
          <div className={`task--status button is-static is-small is-light is-${statusColor} mr-4`}>{taskStatus}</div>
          <span className="task--edit mr-3">
            <i onClick={e => setLoadTaskInlineForm(true)} data-task={props.task._id} className="fa fa-edit"></i>
          </span>
          <span className="task--delete">
            <i onClick={e => props.handleDeleteTaskClick(e)} data-task={props.task._id} className="fa fa-times"></i>
          </span>
        </div>
      )}
    </>
  )
}

export default Task
