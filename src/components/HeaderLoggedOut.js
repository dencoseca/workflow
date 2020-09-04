import React, { useState } from 'react'

function HeaderLoggedOut() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [signUpRequestCount, setSignUpRequestCount] = useState(0)
  const [loginRequestCount, setLoginRequestCount] = useState(0)

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
