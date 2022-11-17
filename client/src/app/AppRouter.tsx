import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Homepage from '../pages/Homepage'
import Login from '../pages/Login'
// import { AuthRoute } from './AuthRoute'

// TODO: Figure authentication flow again.
export default function AppRouter(): JSX.Element {
  return (
    <Router>
      <div className="App">
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        <Routes>
          {/* <Route path="/" element={<AuthRoute />}>
            <Route path="/home" element={<Homepage />} />
          </Route> */}
          <Route path="/" element={<Homepage />} />

          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  )
}
