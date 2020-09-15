import React, { useEffect, useContext, useState } from 'react'
import Page from './Page'
import StateContext from '../StateContext'
import DispatchContext from '../DispatchContext'
import axios from 'axios'
import CenteredInContainer from './CenteredInContainer'
import LoadingDotsIcon from './LoadingDotsIcon'

function Welcome() {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [signUpRequestCount, setSignUpRequestCount] = useState(0)

  useEffect(() => {
    const ourRequest = axios.CancelToken.source()
    if (signUpRequestCount > 0) {
      appDispatch({ type: 'startServerRequest' })

      async function signUp() {
        try {
          const response = await axios.post(
            '/user/signup',
            { username: username.trim(), password: password.trim() },
            { cancelToken: ourRequest.token }
          )
          if (response.data.errorMessage) {
            appDispatch({ type: 'flashMessage', value: response.data.errorMessage, color: 'danger' })
            appDispatch({ type: 'stopServerRequest' })
          } else if (response.data.successMessage) {
            appDispatch({ type: 'flashMessage', value: response.data.successMessage, color: 'success' })
            appDispatch({ type: 'login', value: response.data.user })
            appDispatch({ type: 'stopServerRequest' })
          }
        } catch (err) {
          console.log(err, 'There was a problem or the request was cancelled.')
          appDispatch({ type: 'flashMessage', value: 'Oops... something went wrong', color: 'danger' })
          appDispatch({ type: 'stopServerRequest' })
        }
      }
      signUp()
    }
    return () => {
      ourRequest.cancel()
    }
  }, [signUpRequestCount])

  function handleSubmit(e) {
    e.preventDefault()
    if (!username.trim()) {
      appDispatch({ type: 'flashMessage', value: 'Username cannot be blank', color: 'danger' })
    } else if (!password.trim()) {
      appDispatch({ type: 'flashMessage', value: 'Password cannot be blank', color: 'danger' })
    } else if (username && password) {
      setSignUpRequestCount(prev => prev + 1)
    }
  }

  return (
    <Page title="Welcome">
      {appState.waitingForServer ? (
        <CenteredInContainer minHeight="500px">
          <LoadingDotsIcon />
        </CenteredInContainer>
      ) : (
        <div className="welcome--main-container columns">
          <div className="welcome--sub-container column is-one-half">
            <h1 className="welcome--title mb-5">Let's Get Started!</h1>
            <p className="welcome--subtitle has-text-grey">
              Create projects and tasks and manage your progress. We think project management should be simple. Just sign up or login to start
              organising your workflow.
            </p>
          </div>
          <div className="welcome--sub-container column is-one-half">
            <form onSubmit={e => handleSubmit(e)} className="px-6">
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
                    className="input mb-4"
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
                    className="input mb-4"
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
      )}
    </Page>
  )
}

export default Welcome
