import React, { useEffect } from 'react'
import StateContext from './StateContext'
import DispatchContext from './DispatchContext'
import { useImmerReducer } from 'use-immer'

// COMPONENTS
import Header from './components/Header'
import Welcome from './components/Welcome'

function App() {
  const initialState = {
    loggedIn: Boolean(localStorage.getItem('workflowUserId')),
    user: {
      _id: '',
      username: ''
    }
  }

  function reducer(draft, action) {
    switch (action.type) {
      case 'login':
        draft.loggedIn = true
        draft.user._id = action.value._id
        draft.user.username = action.value.username
        break
      case 'logout':
        draft.loggedIn = false
        break
      default:
        break
    }
  }

  const [state, dispatch] = useImmerReducer(reducer, initialState)

  useEffect(() => {
    if (state.loggedIn) {
      localStorage.setItem('workflowUserId', state.user._id)
      localStorage.setItem('workflowUsername', state.user.username)
    } else {
      localStorage.removeItem('workflowUserId')
      localStorage.removeItem('workflowUsername')
    }
  }, [state.loggedIn])

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
