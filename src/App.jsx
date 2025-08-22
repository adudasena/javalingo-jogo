import React from 'react'

import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import LevelTest from './pages/LevelTest'
import Quiz from './pages/Quiz'
import Shop from './pages/Shop'
import Profile from './pages/Profile'
import { getState } from './lib/storage'

export default function App(){
  const s = getState()
  const isAuth = Boolean(s.user)
  return (
    <Routes>
      <Route path="/" element={ isAuth ? <Navigate to="/home" /> : <Login /> } />
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<Guard><Home /></Guard>} />
      <Route path="/leveltest" element={<Guard><LevelTest /></Guard>} />
      <Route path="/quiz" element={<Guard><Quiz /></Guard>} />
      <Route path="/shop" element={<Guard><Shop /></Guard>} />
      <Route path="/profile" element={<Guard><Profile /></Guard>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

function Guard({ children }){
  const s = getState()
  if(!s.user) return <Navigate to="/login" />
  return children
}
