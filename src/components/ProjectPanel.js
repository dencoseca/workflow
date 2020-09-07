import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import DispatchContext from '../DispatchContext'
import LoadingDotsIcon from './LoadingDotsIcon'
import CenteredInContainer from './CenteredInContainer'
import Task from './Task'

function ProjectPanel(props) {
  const appDispatch = useContext(DispatchContext)
  const projectId = props.projectId
  const [project, setProject] = useState({})
  const [projectTasks, setProjectTasks] = useState([])
  const [newTaskValue, setNewTaskValue] = useState('')
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
      if (!newTaskValue) {
        appDispatch({ type: 'flashMessage', value: 'New task value cannot be blank', color: 'danger' })
      } else {
        const ourRequest = axios.CancelToken.source()

        async function createNewTask() {
          try {
            const response = await axios.post('http://localhost:8080/task/create', { projectId, value: newTaskValue }, { cancelToken: ourRequest.token })
            if (response.data.errorMessage) {
              appDispatch({ type: 'flashMessage', value: response.data.errorMessage, color: 'danger' })
            } else {
              appDispatch({ type: 'flashMessage', value: 'Task successfully created', color: 'success' })
              setProjectTasks(prev => [...prev, response.data])
              setNewTaskValue('')
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

  return (
    <div className="taskview">
      {projectId ? (
        projectIsLoading ? (
          <CenteredInContainer>
            <LoadingDotsIcon />
          </CenteredInContainer>
        ) : (
          <div className="taskview--project">
            <h2 className="taskview--project-title title is-3">{project.name}</h2>
            {projectTasks.length > 0 && projectTasks.map(task => <Task key={task._id} task={task} />)}
            <form onSubmit={handleNewTaskRequest} className="mt-3">
              <div className="field">
                <div className="control">
                  <input onChange={e => setNewTaskValue(e.target.value)} value={newTaskValue} className="taskview--new-task-input quiet-input input is-shadowless is-radiusless pl-0" type="text" placeholder="&#x0002B;  Add a new task"></input>
                </div>
                {newTaskValue && <p className="help is-info">press ENTER to create the new task</p>}
              </div>
            </form>
          </div>
        )
      ) : (
        <div className="taskview--no-project">
          <h3 className="subtitle is-4">Choose a project or create a new one to start adding tasks...</h3>
        </div>
      )}
    </div>
  )
}

export default ProjectPanel
