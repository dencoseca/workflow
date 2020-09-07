import React, { useContext, useEffect, useState } from 'react'
import Page from './Page'
import StateContext from '../StateContext'
import DispatchContext from '../DispatchContext'
import axios from 'axios'
import LoadingDotsIcon from './LoadingDotsIcon'
import ProjectPanel from './ProjectPanel.js'

function Home() {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const [projectsAreLoading, setProjectsAreLoading] = useState(true)
  const [projects, setProjects] = useState([])
  const [newProjectName, setNewProjectName] = useState('')
  const [newProjectRequest, setNewProjectRequest] = useState(0)
  const [fetchProjectsRequest, setFetchProjectsRequest] = useState(0)
  const [selectedProject, setSelectedProject] = useState('')

  useEffect(() => {
    const ourRequest = axios.CancelToken.source()

    async function fetchProjects() {
      try {
        const response = await axios.post('http://localhost:8080/project/findall', { userId: appState.user.userId }, { cancelToken: ourRequest.token })
        if (response.data.errorMessage) {
          appDispatch({ type: 'flashMessage', value: response.data.errorMessage, color: 'danger' })
        } else {
          setProjects(response.data)
          setProjectsAreLoading(false)
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
    const clickedProjectId = e.target.dataset.project
    async function deleteProject() {
      try {
        const response = await axios.post('http://localhost:8080/project/delete', { projectId: clickedProjectId }, { cancelToken: ourRequest.token })
        if (response.data.errorMessage) {
          appDispatch({ type: 'flashMessage', value: response.data.errorMessage, color: 'danger' })
        } else if (response.data.successMessage) {
          setFetchProjectsRequest(prev => prev + 1)
          appDispatch({ type: 'flashMessage', value: response.data.successMessage, color: 'warning' })
          selectedProject === clickedProjectId && setSelectedProject('')
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
            <h3 className="home--project-list-title subtitle is-3 mb-6">
              <strong className="has-text-primary">{appState.user.username}'s</strong> Projects
            </h3>
            {projectsAreLoading ? (
              <LoadingDotsIcon />
            ) : (
              projects.map(project => (
                <div className="home--project-list-item mt-1" key={project._id}>
                  <span className="icon">
                    <i onClick={e => handleProjectDelete(e)} className="home--project-list-item-delete fa fa-trash has-text-danger" data-project={project._id}></i>
                  </span>
                  <span onClick={e => setSelectedProject(project._id)} className="home--project-list-item-name">
                    {project.name}
                  </span>
                </div>
              ))
            )}
            <form onSubmit={handleNewProjectRequest} className="mt-3">
              <div className="field">
                <div className="control">
                  <input onChange={e => setNewProjectName(e.target.value)} value={newProjectName} className="home--project-list-input quiet-input input is-shadowless is-radiusless pl-0" type="text" placeholder="&#x0002B;  Add a new project"></input>
                </div>
                {newProjectName && <p className="help is-info">press ENTER to create the new project</p>}
              </div>
            </form>
          </div>
          <div className="column is-three-quarters">
            <ProjectPanel projectId={selectedProject} />
          </div>
        </div>
      </div>
    </Page>
  )
}

export default Home
