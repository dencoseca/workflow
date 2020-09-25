import React from 'react'
import ReactDOM from 'react-dom'
import 'bulma/css/bulma.css'
import './index.scss'
import App from './App'
import axios from 'axios'
axios.defaults.baseURL = process.env.REACT_APP_API_ENDPOINT

// Uncoment to debug CSS
// import './debug.css'

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)

