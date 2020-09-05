import React, { useContext, useEffect, useState } from 'react'
import Page from './Page'
import StateContext from '../StateContext'
import DispatchContext from '../DispatchContext'
import axios from 'axios'
import FlashMessages from './FlashMessages'

function Home() {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const [projects, setProjects] = useState([])
  const [newProjectName, setNewProjectName] = useState('')
  const [newProjectRequest, setNewProjectRequest] = useState(0)
  const [fetchProjectsRequest, setFetchProjectsRequest] = useState(0)

  useEffect(() => {
    const ourRequest = axios.CancelToken.source()

    async function fetchProjects() {
      try {
        const response = await axios.post('http://localhost:8080/project/findall', { userId: appState.user.userId }, { cancelToken: ourRequest.token })
        if (response.data.errorMessage) {
          appDispatch({ type: 'flashMessage', value: response.data.errorMessage, color: 'danger' })
        } else {
          setProjects(response.data)
        }
      } catch (e) {
        console.log('There was a problem or the request was cancelled.')
      }
    }
    fetchProjects()
    return () => {
      ourRequest.cancel()
    }
  }, [fetchProjectsRequest])

  useEffect(() => {
    if (newProjectRequest > 0) {
      if (!newProjectName) {
        appDispatch({ type: 'flashMessage', value: 'New project name cannot be blank', color: 'danger' })
      } else {
        const ourRequest = axios.CancelToken.source()

        async function createNewProject() {
          try {
            const response = await axios.post('http://localhost:8080/project/create', { userId: appState.user.userId, name: newProjectName }, { cancelToken: ourRequest.token })
            if (response.data.errorMessage) {
              appDispatch({ type: 'flashMessage', value: response.data.errorMessage, color: 'danger' })
            } else {
              setProjects(prev => [...prev, response.data])
              appDispatch({ type: 'flashMessage', value: 'Project successfully created', color: 'success' })
              setNewProjectName('')
            }
          } catch (e) {
            console.log('There was a problem or the request was cancelled.')
          }
        }
        createNewProject()
        return () => {
          ourRequest.cancel()
        }
      }
    }
  }, [newProjectRequest])

  function handleNewProjectRequest(e) {
    e.preventDefault()
    setNewProjectRequest(prev => prev + 1)
  }

  function handleProjectDelete(e) {
    const ourRequest = axios.CancelToken.source()
    async function deleteProject() {
      try {
        const response = await axios.post('http://localhost:8080/project/delete', { projectId: e.target.dataset.project }, { cancelToken: ourRequest.token })
        if (response.data.errorMessage) {
          appDispatch({ type: 'flashMessage', value: response.data.errorMessage, color: 'danger' })
        } else if (response.data.successMessage) {
          setFetchProjectsRequest(prev => prev + 1)
          appDispatch({ type: 'flashMessage', value: response.data.successMessage, color: 'success' })
        }
      } catch (e) {
        console.log('There was a problem or the request was cancelled.')
      }
    }
    deleteProject()
    return () => {
      ourRequest.cancel()
    }
  }

  return (
    <Page title="Home">
      <div className="home mt-5">
        <div className="columns">
          <div className="home--project-list column is-one-quarter">
            <h3 className="home--project-list-title subtitle is-4 mb-3">
              <strong>{appState.user.username}'s</strong> Projects
            </h3>
            {projects.map(project => (
              <div className="home--project-list-item mt-1" key={project._id}>
                <span className="home--project-list-item-name">{project.name}</span>
                <i onClick={e => handleProjectDelete(e)} className="home--project-list-item-delete fa fa-trash has-text-danger" data-project={project._id}></i>
              </div>
            ))}
            <form onSubmit={handleNewProjectRequest} className="mt-3">
              <div className="control">
                <input onChange={e => setNewProjectName(e.target.value)} value={newProjectName} className="home--project-list-input input is-shadowless is-radiusless pl-0" type="text" placeholder="&#x0002B;  Add a new project"></input>
              </div>
            </form>
          </div>
          <div className="column is-three-quarters">{/* show project tasks here */}</div>
        </div>
      </div>
    </Page>
  )
}

export default Home
