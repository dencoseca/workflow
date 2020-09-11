import React, { useEffect, useContext, useState } from 'react'
import Page from './Page'
import DispatchContext from '../DispatchContext'
import axios from 'axios'

function Welcome() {
  const appDispatch = useContext(DispatchContext)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [signUpRequestCount, setSignUpRequestCount] = useState(0)

  useEffect(() => {
    if (signUpRequestCount > 0) {
      const ourRequest = axios.CancelToken.source()

      async function signUp() {
        try {
          const response = await axios.post('http://localhost:8080/user/signup', { username, password }, { cancelToken: ourRequest.token })
          if (response.data.errorMessage) {
            appDispatch({ type: 'flashMessage', value: response.data.errorMessage, color: 'danger' })
          } else {
            appDispatch({ type: 'flashMessage', value: response.data.successMessage, color: 'success' })
            appDispatch({ type: 'login', value: response.data.user })
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

  function handleSubmit(e) {
    e.preventDefault()
    if (!username) {
      appDispatch({ type: 'flashMessage', value: 'Username cannot be blank', color: 'danger' })
    } else if (!password) {
      appDispatch({ type: 'flashMessage', value: 'Password cannot be blank', color: 'danger' })
    } else if (username && password) {
      setSignUpRequestCount(prev => prev + 1)
    }
  }

  return (
    <Page title="Welcome">
      <div className="welcome--main-container mt-6 mx-6 columns">
        <div className="welcome--sub-container column is-one-half">
          <h1 className="title is-1 mb-6">Let's Get Started!</h1>
          <p className="subtitle has-text-grey">
            Create projects and tasks and manage your progress. We think project management should be simple. Just sign up or login to start
            organising your workflow.
          </p>
        </div>
        <div className="welcome--sub-container column is-one-half">
          <form onSubmit={e => handleSubmit(e)} className="mx-6">
            <div className="field">
              <label htmlFor="username" className="label">
                Username
              </label>
              <div className="control">
                <input
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  type="text"
                  id="username"
                  className="input"
                  placeholder="Pick a username"
                ></input>
              </div>
            </div>
            <div className="field">
              <label htmlFor="password" className="label">
                Password
              </label>
              <div className="control">
                <input
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  type="password"
                  id="password"
                  className="input"
                  placeholder="Create a password"
                ></input>
              </div>
            </div>
            <div className="control">
              <button className="button is-primary is-large is-fullwidth mt-5">
                <span className="welcome--bold-button-text has-text-weight-bold">Sign up</span> for Workflow
              </button>
            </div>
          </form>
        </div>
      </div>
    </Page>
  )
}

export default Welcome
