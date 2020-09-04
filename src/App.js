import React, { useEffect } from 'react'

// COMPONENTS
import Header from './components/Header'
import Welcome from './components/Welcome'

import Axios from 'axios'
Axios.defaults.baseURL = process.env.BACKENDURL || ''

function App() {
  return (
    <>
      <Header />
      <Welcome />
    </>
  )
}

export default App
