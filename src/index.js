import React from 'react'
import ReactDOM from 'react-dom'
import 'bulma/css/bulma.css'
import './styles/main.scss'
import App from './App'
// import './styles/debug.css' // Uncoment to debug CSS
import axios from 'axios'
axios.defaults.baseURL = process.env.REACT_APP_API_ENDPOINT


ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)

