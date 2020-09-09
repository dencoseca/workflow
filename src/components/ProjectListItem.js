import React from 'react'

function ProjectListItem(props) {
  return (
    <div className="project-list--item mt-1">
      <span className="icon">
        <i
          onClick={e => props.handleProjectDelete(e)}
          className="project-list--item-delete fa fa-trash has-text-danger"
          data-project={props.project._id}
        ></i>
      </span>
      <span onClick={e => props.setSelectedProject(props.project._id)} className="project-list--item-name">
        {props.project.name}
      </span>
    </div>
  )
}

export default ProjectListItem
