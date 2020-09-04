import React, { useContext } from 'react'
import StateContext from '../StateContext'
import DispatchContext from '../DispatchContext'

function HeaderLoggedIn() {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  function logOut() {
    appDispatch({ type: 'logout' })
  }

  return (
    <div className="header-logged-in">
      <h2>Logged in as {appState.user.username}</h2>
      <button onClick={e => logOut()} className="button is-light ml-3">
        Log out
      </button>
    </div>
  )
}

export default HeaderLoggedIn
