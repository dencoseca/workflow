import React, { useState } from 'react'

function HeaderLoggedOut() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

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
        <a href="/" className="button is-primary">
          <strong>Sign up</strong>
        </a>
        <a href="/" className="button is-light">
          Log in
        </a>
      </div>
    </div>
  )
}

export default HeaderLoggedOut
