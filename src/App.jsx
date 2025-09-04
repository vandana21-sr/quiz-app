import React from 'react'
import { Link, Outlet } from 'react-router-dom'

export default function App(){
  return (
    <div className="app-root">
      <header className="header">
        <h1>Quiz App</h1>
        <nav>
          <Link to="/quiz">Quiz</Link>
          <Link to="/results">Results</Link>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
