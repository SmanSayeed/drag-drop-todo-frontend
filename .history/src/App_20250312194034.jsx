import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route, Routes } from 'react-router'
import Home from './components/pages/Home/Home'
import NoMatch from './components/pages/NoMatch/NoMatch'
import Login from './components/pages/Login/Login'
import Register from './components/pages/Register/Register'

function App() {
 

  return (
    <>
         <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Home />} />
            <Route path="*" element={<NoMatch />} />
         </Routes>
      
    </>
  )
}

export default App
