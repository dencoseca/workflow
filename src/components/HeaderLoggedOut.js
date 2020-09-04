import React, { useEffect } from 'react'

function HeaderLoggedOut() {
  return (
    <div className="header-logged-out">
      <form>
        <div className="control mr-2">
          <input className="input"  type="text" name="username"placeholder="username"></input>
        </div>
        <div className="control mr-2">
          <input className="input"  type="password" name="password"placeholder="password"></input>
        </div>
      </form>
      <div className="buttons">
        <a className="button is-primary">
          <strong>Sign up</strong>
        </a>
        <a className="button is-light">Log in</a>
      </div>
    </div>
  )
}

export default HeaderLoggedOut
