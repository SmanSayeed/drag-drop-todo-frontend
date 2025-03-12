import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route, Routes } from 'react-router'
import Home from './components/pages/Home/Home'
import NoMatch from './components/pages/NoMatch/NoMatch'

function App() {
 

  return (
    <>
         <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Home />} />
            <Route path="*" element={<NoMatch />} />
         </Routes>
      
    </>
  )
}

export default App
