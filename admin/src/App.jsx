import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Admin from './pages/Admin'
import Login from './pages/Login'

const App = () => {
  return (
     <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />}/>
        <Route path='/admin' element={<Admin />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
 