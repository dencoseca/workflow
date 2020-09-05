import React, { useContext, useEffect, useState } from 'react'
import Page from './Page'
import StateContext from '../StateContext'
import DispatchContext from '../DispatchContext'
import axios from 'axios'

function Home() {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const [projects, setProjects] = useState([])

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
          <div className="column is-one-fourth">
            <h3>
              <strong>{appState.user.username}'s</strong> Projects
            </h3>
            {projects.map(project => (
              <p key={project._id}>{project.name}</p>
            ))}
          </div>
          <div className="column is-three-fourths">{/* show project tasks here */}</div>
        </div>
      </div>
    </Page>
  )
}

export default Home
