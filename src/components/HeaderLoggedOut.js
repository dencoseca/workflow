import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import DispatchContext from '../DispatchContext'

function HeaderLoggedOut() {
  const appDispatch = useContext(DispatchContext)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginRequestCount, setLoginRequestCount] = useState(0)

  // -------------------------------------------------- //
  // PROCESS A LOGIN REQUEST
  // -------------------------------------------------- //

  useEffect(() => {
    const ourRequest = axios.CancelToken.source()
    if (loginRequestCount > 0) {
      // Input validation
      if (!username.trim()) {
        appDispatch({ type: 'flashMessage', value: 'Cannot login without username', color: 'danger' })
      } else if (!password.trim()) {
        appDispatch({ type: 'flashMessage', value: 'Cannot login without password', color: 'danger' })
      } else {
        appDispatch({ type: 'startServerRequest' })

        // Login with API
        async function login() {
          try {
            const response = await axios.post(
              '/user/login',
              { username: username.trim(), password: password.trim() },
              { cancelToken: ourRequest.token }
            )
            if (response.data.errorMessage) {
              appDispatch({ type: 'flashMessage', value: response.data.errorMessage, color: 'danger' })
              appDispatch({ type: 'stopServerRequest' })
            } else {
              appDispatch({ type: 'login', value: response.data })
              appDispatch({ type: 'stopServerRequest' })
            }
          } catch (err) {
            console.log(err, 'There was a problem or the request was cancelled.')
          }
        }
        login()
      }
    }
    return () => {
      ourRequest.cancel()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loginRequestCount])

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      setLoginRequestCount(prev => prev + 1)
    }
  }

  return (
    <div className="header-logged-out">
      <form onKeyDown={handleKeyDown}>
        <div className="control mr-2">
          <input
            onChange={e => setUsername(e.target.value)}
            value={username}
            className="input"
            type="text"
            name="username"
            placeholder="username"
          ></input>
        </div>
        <div className="control mr-2">
          <input
            onChange={e => setPassword(e.target.value)}
            value={password}
            className="input"
            type="password"
            name="password"
            placeholder="password"
          ></input>
        </div>
      </form>
      <button onClick={e => setLoginRequestCount(prev => prev + 1)} className="button is-primary has-text-weight-bold">
        Log in
      </button>
    </div>
  )
}

export default HeaderLoggedOut
