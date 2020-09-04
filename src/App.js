import React, { useEffect } from 'react'
import StateContext from './StateContext'
import DispatchContext from './DispatchContext'
import { useImmerReducer } from 'use-immer'

// COMPONENTS
import Header from './components/Header'
import Welcome from './components/Welcome'

import Axios from 'axios'
Axios.defaults.baseURL = process.env.BACKENDURL || ''

function App() {
  const initialState = {
    isLoggedIn: false,
    user: {
      username: '',
      userId: ''
    }
  }

  function reducer(draft, action) {
    switch (action.type) {
      case 'login':
        draft.isLoggedIn = true
        draft.user = action.data
        break
      case 'logout':
        draft.isLoggedIn = false
        break
    }
  }

  const [state, dispatch] = useImmerReducer(reducer, initialState)

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <Header />
        <Welcome />
      </DispatchContext.Provider>
    </StateContext.Provider>
  )
}

export default App
