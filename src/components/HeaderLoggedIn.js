import React, { useContext } from 'react'
import StateContext from '../StateContext'
import DispatchContext from '../DispatchContext'

function HeaderLoggedIn() {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  return (
    <>
      <h2>Logged in as {appState.user.username}</h2>
      <button onClick={appDispatch({ type: 'logout' })} className="button is-light ml-3">
        Log out
      </button>
    </>
  )
}

export default HeaderLoggedIn
