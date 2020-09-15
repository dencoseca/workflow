import React, { useContext, useEffect, useState } from 'react'
import Page from './Page'
import StateContext from '../StateContext'
import DispatchContext from '../DispatchContext'
import axios from 'axios'
import LoadingDotsIcon from './LoadingDotsIcon'
import ProjectPanel from './ProjectPanel.js'
import ProjectListItem from './ProjectListItem'

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
        const response = await axios.post('/project/findall', { userId: appState.user.userId }, { cancelToken: ourRequest.token })
        if (response.data.errorMessage) {
          appDispatch({ type: 'flashMessage', value: response.data.errorMessage, color: 'danger' })
        } else {
          setProjects(response.data)
          setProjectsAreLoading(false)
        }
      } catch (err) {
        console.log(err, 'There was a problem or the request was cancelled.')
      }
    }
    fetchProjects()
    return () => {
      ourRequest.cancel()
    }
  }, [appDispatch, appState.user.userId, fetchProjectsRequest])

  useEffect(() => {
    const ourRequest = axios.CancelToken.source()
    if (newProjectRequest > 0) {
      if (!newProjectName) {
        appDispatch({ type: 'flashMessage', value: 'New project name cannot be blank', color: 'danger' })
      } else {
        async function createNewProject() {
          try {
            const response = await axios.post(
              '/project/create',
              { userId: appState.user.userId, name: newProjectName.trim() },
              { cancelToken: ourRequest.token }
            )
            if (response.data.errorMessage) {
              appDispatch({ type: 'flashMessage', value: response.data.errorMessage, color: 'danger' })
            } else {
              setProjects(prev => [...prev, response.data])
              appDispatch({ type: 'flashMessage', value: 'Project successfully created', color: 'success' })
              setNewProjectName('')
              setSelectedProject(response.data._id)
            }
          } catch (err) {
            console.log(err, 'There was a problem or the request was cancelled.')
          }
        }
        createNewProject()
      }
    }
    return () => {
      ourRequest.cancel()
    }
  }, [appDispatch, appState.user.userId, newProjectName, newProjectRequest])

  function handleNewProjectRequest(e) {
    e.preventDefault()
    setNewProjectRequest(prev => prev + 1)
  }

  function handleProjectDelete(e) {
    const ourRequest = axios.CancelToken.source()
    const clickedProjectId = e.target.dataset.project
    async function deleteProject() {
      try {
        const response = await axios.post('/project/delete', { projectId: clickedProjectId }, { cancelToken: ourRequest.token })
        if (response.data.errorMessage) {
          appDispatch({ type: 'flashMessage', value: response.data.errorMessage, color: 'danger' })
        } else if (response.data.successMessage) {
          setFetchProjectsRequest(prev => prev + 1)
          appDispatch({ type: 'flashMessage', value: response.data.successMessage, color: 'warning' })
          selectedProject === clickedProjectId && setSelectedProject('')
        }
      } catch (err) {
        console.log(err, 'There was a problem or the request was cancelled.')
      }
    }
    deleteProject()
  }

  return (
    <Page title="Home">
      <div className="home">
        <div className="columns">
          <div className="home--project-list column is-one-quarter">
            <h3 className="home--project-list-title subtitle is-3 mb-6">
              <strong className="has-text-primary">{appState.user.username}'s</strong> Projects
            </h3>
            {projectsAreLoading ? (
              <LoadingDotsIcon />
            ) : (
              projects.map(project => (
                <ProjectListItem
                  key={project._id}
                  setSelectedProject={setSelectedProject}
                  handleProjectDelete={handleProjectDelete}
                  project={project}
                />
              ))
            )}
            <form onSubmit={handleNewProjectRequest} className="mt-3">
              <div className="field">
                <div className="control">
                  <input
                    onChange={e => setNewProjectName(e.target.value)}
                    value={newProjectName}
                    className="home--project-list-input quiet-input input is-shadowless is-radiusless pl-0"
                    type="text"
                    placeholder="&#x0002B;  Add a new project"
                  ></input>
                </div>
                {newProjectName && <p className="help is-primary">press ENTER to create the new project</p>}
              </div>
            </form>
          </div>
          <div className="column is-three-quarters">
            <ProjectPanel projectId={selectedProject} setFetchProjectsRequest={setFetchProjectsRequest} />
          </div>
        </div>
      </div>
    </Page>
  )
}

export default Home
