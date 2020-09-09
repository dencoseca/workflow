import React, { useState, useEffect, useContext, useRef } from 'react'
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
  const [editingProjectName, setEditingProjectName] = useState(false)
  const [projectName, setProjectName] = useState('')
  const [initialProjectName, setInitialProjectName] = useState('')
  const projectNameInputEl = useRef(null)

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
            setProjectName(response.data.name)
            setInitialProjectName(response.data.name)
            setProjectIsLoading(false)
            setEditingProjectName(false)
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
        appDispatch({ type: 'flashMessage', value: 'Task value cannot be blank', color: 'danger' })
      } else if (taskCategory === 'Category') {
        appDispatch({ type: 'flashMessage', value: 'Task category cannot be blank', color: 'danger' })
      } else if (taskStatus === 'Status') {
        appDispatch({ type: 'flashMessage', value: 'Task Status cannot be blank', color: 'danger' })
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

  useEffect(() => {
    if (editingProjectName) {
      setInitialProjectName(projectName)
      projectNameInputEl.current.focus()
    }
  }, [editingProjectName])

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

  function updateProjectName(e) {
    e.preventDefault()
    if (projectName.trim() != initialProjectName) {
      const ourRequest = axios.CancelToken.source()

      async function updateProjectName() {
        try {
          const response = await axios.post(
            'http://localhost:8080/project/update',
            { projectId: props.projectId, project: { name: projectName.trim() } },
            { cancelToken: ourRequest.token }
          )
          if (response.data.errorMessage) {
            appDispatch({ type: 'flashMessage', value: response.data.errorMessage, color: 'danger' })
          } else {
            appDispatch({ type: 'flashMessage', value: response.data.successMessage, color: 'success' })
            setProjectName(response.data.updatedProject.name)
            setEditingProjectName(false)
          }
        } catch (err) {
          console.log('There was a problem or the request was cancelled.')
        }
      }
      updateProjectName()
      return () => {
        ourRequest.cancel()
      }
    } else {
      setEditingProjectName(false)
    }
  }

  function handleUndoEditClick() {
    setProjectName(initialProjectName)
    setEditingProjectName(false)
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
            <div className="project-panel--project-title-container">
              {editingProjectName ? (
                <>
                  <div className="project-panel--project-form-highlight">
                    <form onSubmit={e => updateProjectName(e)}>
                      <input
                        onChange={e => setProjectName(e.target.value)}
                        type="text"
                        className="project-panel--project-title-edit-input input quiet-input-no-focus is-shadowless title is-3"
                        value={projectName}
                        ref={projectNameInputEl}
                      />
                    </form>
                    <i onClick={handleUndoEditClick} className="project-panel--project-form-highlight-undo fa fa-undo ml-3"></i>
                  </div>
                  {projectName.trim() != initialProjectName && <p className="help is-primary mt-2">press ENTER to confirm edit</p>}
                </>
              ) : (
                <>
                  <h2 className="project-panel--project-title title is-3">{projectName}</h2>
                  <span className="icon ml-3">
                    <i onClick={e => setEditingProjectName(true)} className="fa fa-edit"></i>
                  </span>
                </>
              )}
            </div>
            <div className="project-panel--tasks">
              {projectTasks.length > 0 &&
                projectTasks.map(task => (
                  <Task key={task._id} task={task} handleDeleteTaskClick={handleDeleteTaskClick} setProjectTasks={setProjectTasks} />
                ))}
            </div>
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
              withFocus={true}
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
