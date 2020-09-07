import React from 'react'

function ProjectTaskView(props) {
  const projectId = props.projectId

  return <div className="taskview">{projectId ? '' : <h3 className="subtitle is-4">Choose a project or create a new one to start adding tasks...</h3>}</div>
}

export default ProjectTaskView
