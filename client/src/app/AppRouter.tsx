import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import BlockPage from '../pages/BlockPage'
import Board from '../pages/Board'
import CreateBlock from '../pages/CreateBlock'
import CreateGroup from '../pages/CreateGroup'
import Dashboard from '../pages/Dashboard'
import GroupPage from '../pages/GroupPage'
import Login from '../pages/Login'
import Profile from '../pages/Profile'
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
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/board" element={<Board />} />
          <Route path="/createGroup" element={<CreateGroup />} />
          <Route path="/createBlock" element={<CreateBlock />} />
          <Route path="/group/:groupId" element={<GroupPage />} />
          <Route path="/block/:blockId" element={<BlockPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  )
}
