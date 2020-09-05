import React, { useContext, useEffect, useState } from 'react'
import Page from './Page'
import StateContext from '../StateContext'
import DispatchContext from '../DispatchContext'
import axios from 'axios'

function Home() {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const [projects, setProjects] = useState([])
  const [newProjectName, setNewProjectName] = useState('')

  useEffect(() => {
    const ourRequest = axios.CancelToken.source()

    async function fetchProjects() {
      try {
        const response = await axios.post('http://localhost:8080/project/findall', { userId: appState.user._id }, { cancelToken: ourRequest.token })
        if (response.data.message) {
          appDispatch({ type: 'flashMessage', value: response.data.message, color: 'danger' })
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
  }, [])

  return (
    <Page title="Home">
      <div className="home mt-5">
        <div className="columns">
          <div className="home--project-list column is-one-quarter">
            <h3 className="home--project-list-title subtitle is-4 mb-3">
              <strong>{appState.user.username}'s</strong> Projects
            </h3>
            {projects.map(project => (
              <div className="home--project-list-item" key={project._id}>
                {project.name}
              </div>
            ))}
            <form className="mt-3">
              <div className="control">
                <input onChange={e => setNewProjectName(e.target.value)} className="home--project-list-input input" type="text" placeholder="&#x0002B;  Add a new project"></input>
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
