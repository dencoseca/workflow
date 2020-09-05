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
    if (signUpRequestCount > 0) {
      const ourRequest = axios.CancelToken.source()

      async function signUp() {
        try {
          const response = await axios.post('http://localhost:8080/user/signup', { username, password }, { cancelToken: ourRequest.token })
          if (response.data.message) {
            appDispatch({ type: 'flashMessage', value: response.data.message, color: 'danger' })
          } else {
            appDispatch({ type: 'login', value: response.data })
          }
        } catch (e) {
          console.log('There was a problem or the request was cancelled.')
        }
      }
      signUp()
      return () => {
        ourRequest.cancel()
      }
    }
  }, [signUpRequestCount])

  useEffect(() => {
    if (loginRequestCount > 0) {
      const ourRequest = axios.CancelToken.source()

      async function login() {
        try {
          const response = await axios.post('http://localhost:8080/user/login', { username, password }, { cancelToken: ourRequest.token })
          if (response.data.message) {
            appDispatch({ type: 'flashMessage', value: response.data.message, color: 'danger' })
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

  return (
    <div className="header-logged-out">
      <form>
        <div className="control mr-2">
          <input onChange={e => setUsername(e.target.value)} value={username} className="input" type="text" name="username" placeholder="username"></input>
        </div>
        <div className="control mr-2">
          <input onChange={e => setPassword(e.target.value)} value={password} className="input" type="password" name="password" placeholder="password"></input>
        </div>
      </form>
      <div className="buttons">
        <button onClick={e => setSignUpRequestCount(prev => prev + 1)} className="button is-primary">
          <strong>Sign up</strong>
        </button>
        <button onClick={e => setLoginRequestCount(prev => prev + 1)} className="button is-light">
          Log in
        </button>
      </div>
    </div>
  )
}

export default HeaderLoggedOut
