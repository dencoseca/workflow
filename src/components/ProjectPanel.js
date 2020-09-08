import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import DispatchContext from '../DispatchContext'
import LoadingDotsIcon from './LoadingDotsIcon'
import CenteredInContainer from './CenteredInContainer'
import Task from './Task'
import TaskInlineForm from './TaskInlineForm'

function ProjectPanel(props) {
  const appDispatch = useContext(DispatchContext)
  const projectId = props.projectId
  const [project, setProject] = useState({})
  const [projectTasks, setProjectTasks] = useState([])
  const [taskValue, setTaskValue] = useState('')
  const [taskCategory, setTaskCategory] = useState('Category')
  const [taskStatus, setTaskStatus] = useState('Status')
  const [newTaskRequest, setNewTaskRequest] = useState(0)
  const [projectIsLoading, setProjectIsLoading] = useState(true)

  useEffect(() => {
    if (projectId) {
      setProjectIsLoading(true)
      const ourRequest = axios.CancelToken.source()
      async function fetchProject() {
        try {
          const response = await axios.post('http://localhost:8080/project/findone', { projectId }, { cancelToken: ourRequest.token })
          if (response.data.errorMessage) {
            appDispatch({ type: 'flashMessage', value: response.data.errorMessage, color: 'danger' })
          } else {
            setProject(response.data)
            setProjectTasks(response.data.tasks)
            setProjectIsLoading(false)
          }
        } catch (e) {
          console.log('There was a problem or the request was cancelled.')
        }
      }
      fetchProject()
      return () => {
        ourRequest.cancel()
      }
    }
  }, [projectId])

  useEffect(() => {
    if (newTaskRequest > 0) {
      if (!taskValue) {
        appDispatch({ type: 'flashMessage', value: 'New task value cannot be blank', color: 'danger' })
      } else {
        const ourRequest = axios.CancelToken.source()

        async function createNewTask() {
          try {
            const response = await axios.post(
              'http://localhost:8080/task/create',
              { projectId, value: taskValue.trim(), category: taskCategory, status: taskStatus },
              { cancelToken: ourRequest.token }
            )
            if (response.data.errorMessage) {
              appDispatch({ type: 'flashMessage', value: response.data.errorMessage, color: 'danger' })
            } else {
              appDispatch({ type: 'flashMessage', value: 'Task successfully created', color: 'success' })
              setProjectTasks(prev => [...prev, response.data])
              setTaskValue('')
              setTaskCategory('Category')
              setTaskStatus('Status')
            }
          } catch (err) {
            console.log('There was a problem or the request was cancelled.')
          }
        }
        createNewTask()
        return () => {
          ourRequest.cancel()
        }
      }
    }
  }, [newTaskRequest])

  function handleNewTaskRequest(e) {
    e.preventDefault()
    setNewTaskRequest(prev => prev + 1)
  }

  function handleDeleteTaskClick(e) {
    const clickedTaskId = e.target.dataset.task
    const ourRequest = axios.CancelToken.source()

    async function deleteTask() {
      try {
        const response = await axios.post('http://localhost:8080/task/delete', { taskId: clickedTaskId }, { cancelToken: ourRequest.token })
        if (response.data.errorMessage) {
          appDispatch({ type: 'flashMessage', value: response.data.errorMessage, color: 'danger' })
        } else {
          appDispatch({ type: 'flashMessage', value: response.data.successMessage, color: 'success' })
          setProjectTasks(prev => prev.filter(task => task._id != clickedTaskId))
        }
      } catch (err) {
        console.log('There was a problem or the request was cancelled.')
      }
    }
    deleteTask()
    return () => {
      ourRequest.cancel()
    }
  }

  return (
    <div className="project-panel">
      {projectId ? (
        projectIsLoading ? (
          <CenteredInContainer>
            <LoadingDotsIcon />
          </CenteredInContainer>
        ) : (
          <div className="project-panel--project">
            <h2 className="project-panel--project-title title is-3">{project.name}</h2>
            {projectTasks.length > 0 &&
              projectTasks.map(task => (
                <Task key={task._id} task={task} handleDeleteTaskClick={handleDeleteTaskClick} setProjectTasks={setProjectTasks} />
              ))}
            <TaskInlineForm
              inputPlaceholderText="&#x0002B;   Add a new task"
              submitButtonText="Add"
              taskValue={taskValue}
              setTaskValue={setTaskValue}
              taskCategory={taskCategory}
              setTaskCategory={setTaskCategory}
              taskStatus={taskStatus}
              setTaskStatus={setTaskStatus}
              submitTask={handleNewTaskRequest}
            />
          </div>
        )
      ) : (
        <div className="project-panel--no-project">
          <h3 className="subtitle is-4">Choose a project or create a new one to start adding tasks...</h3>
        </div>
      )}
    </div>
  )
}

export default ProjectPanel
