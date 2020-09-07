import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import DispatchContext from '../DispatchContext'

function ProjectTaskView(props) {
  const appDispatch = useContext(DispatchContext)
  const projectId = props.projectId
  const [project, setProject] = useState({})

  useEffect(() => {
    if (projectId) {
      const ourRequest = axios.CancelToken.source()
      async function fetchProject() {
        try {
          const response = await axios.post('http://localhost:8080/project/findone', { projectId }, { cancelToken: ourRequest.token })
          if (response.data.errorMessage) {
            appDispatch({ type: 'flashMessage', value: response.data.errorMessage, color: 'danger' })
          } else {
            setProject(response.data)
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

  return (
    <div className="taskview">
      {projectId ? (
        <div className="taskview--workspace">
          <h2 className="title is-3">{project.name}</h2>
        </div>
      ) : (
        <h3 className="subtitle is-4">Choose a project or create a new one to start adding tasks...</h3>
      )}
    </div>
  )
}

export default ProjectTaskView
