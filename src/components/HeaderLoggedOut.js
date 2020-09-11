import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import DispatchContext from '../DispatchContext'

function HeaderLoggedOut() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [signUpRequestCount, setSignUpRequestCount] = useState(0)
  const [loginRequestCount, setLoginRequestCount] = useState(0)

  const appDispatch = useContext(DispatchContext)

  useEffect(() => {
    if (loginRequestCount > 0) {
      const ourRequest = axios.CancelToken.source()

      async function login() {
        try {
          const response = await axios.post('http://localhost:8080/user/login', { username, password }, { cancelToken: ourRequest.token })
          if (response.data.errorMessage) {
            appDispatch({ type: 'flashMessage', value: response.data.errorMessage, color: 'danger' })
          } else {
            appDispatch({ type: 'login', value: response.data })
          }
        } catch (e) {
          console.log('There was a problem or the request was cancelled.')
        }
      }
      login()
      return () => {
        ourRequest.cancel()
      }
    }
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
