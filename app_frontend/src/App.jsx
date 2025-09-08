import { useState } from 'react'
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './Login'
import Manger from './Manger'
import Register from './Register'
import Test from './Test'

function App() {
  const [user, setUser] = useState('')

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-blue-700 mt-8 mb-4">
          Simple Task Manager
        </h1>
        <nav className="flex gap-4 mb-8">
          <NavLink to="/login" className="text-blue-600 hover:underline">Login</NavLink>
          <NavLink to="/register" className="text-blue-600 hover:underline">Register</NavLink>
          <NavLink to="/tasks" className="text-blue-600 hover:underline">Manager</NavLink>
        </nav>
        <div className="w-full max-w-md">
          <Routes>
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/tasks" element={
              user ? (
                <>
                  <p className="mb-2 text-gray-700">Welcome {user.email}</p>
                  <Manger />
                  <Test/>
                </>
              ) : (
                <Login setUser={setUser} />
              )
            } />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
