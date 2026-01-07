import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import ChapterDetail from './components/ChapterDetail'
import DocumentViewer from './components/DocumentViewer'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const auth = localStorage.getItem('studyapp_auth')
    if (auth === 'true') setIsAuthenticated(true)
  }, [])

  const handleLogin = () => {
    localStorage.setItem('studyapp_auth', 'true')
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('studyapp_auth')
    setIsAuthenticated(false)
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <Routes>
      <Route path="/" element={<Dashboard onLogout={handleLogout} />} />
      <Route path="/chapter/:chapterId" element={<ChapterDetail />} />
      <Route path="/chapter/:chapterId/:docId" element={<DocumentViewer />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
