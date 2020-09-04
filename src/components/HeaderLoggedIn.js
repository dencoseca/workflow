import React, { useEffect, useContext } from 'react'
import StateContext from '../StateContext'

function HeaderLoggedIn() {
  const appState = useContext(StateContext)

  return (
    <>
      <h2>Logged in as {appState.user.username}</h2>
    </>
  )
}

export default HeaderLoggedIn
