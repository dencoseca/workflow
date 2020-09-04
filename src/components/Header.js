import React, { useContext } from 'react'
import HeaderLoggedOut from './HeaderLoggedOut'
import HeaderLoggedIn from './HeaderLoggedIn'
import StateContext from '../StateContext'

function Header() {
  const appState = useContext(StateContext)
  const headerContent = appState.loggedIn ? <HeaderLoggedIn /> : <HeaderLoggedOut />

  return (
    <>
      <nav className="navbar" role="navigation" aria-label="main navigation">
        <div className="container">
          <div className="navbar-brand">
            <a className="navbar-item" href="/">
              Workflow
            </a>

            <a href="/" role="button" className="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
            </a>
          </div>

          <div id="navbarBasicExample" className="navbar-menu">
            <div className="navbar-end">
              <div className="navbar-item">{headerContent}</div>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}

export default Header
