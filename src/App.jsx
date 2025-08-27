import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home.jsx'
import LevelTest from './pages/LevelTest'
import TestIntro from './pages/TestIntro'      // <<< IMPORT NOVO
import Quiz from './pages/Quiz'
import Shop from './pages/Shop'
import Profile from './pages/Profile'
import Missions from './pages/Missions'
import Signup from './pages/Signup'
import { getState } from './lib/storage'

function Footer(){
  return (
    <footer className="footer">
      <small>JavaLingo © 2025 <span className="dot">•</span> ™</small>
    </footer>
  )
}

export default function App(){
  const s = getState()
  const isAuth = Boolean(s.user)
  return (
    <div className="page">
      <div className="page-content">
        <Routes>
          <Route path="/" element={ isAuth ? <Navigate to="/home" /> : <Login /> } />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Guard><Home /></Guard>} />

          {/* <<< AGORA O TESTE TEM INTRO E PLAY >>> */}
          <Route path="/leveltest" element={<Guard><TestIntro /></Guard>} />
          <Route path="/leveltest/play" element={<Guard><LevelTest /></Guard>} />

          <Route path="/quiz" element={<Guard><Quiz /></Guard>} />
          <Route path="/shop" element={<Guard><Shop /></Guard>} />
          <Route path="/profile" element={<Guard><Profile /></Guard>} />

          {/* <<< GRID DE 30 NÍVEIS >>> */}
          <Route path="/missions" element={<Guard><Missions /></Guard>} />

          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}

function Guard({ children }){
  const s = getState()
  if(!s.user) return <Navigate to="/login" />
  return children
}