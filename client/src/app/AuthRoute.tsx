import React, { useContext } from 'react'
import AppContext from './AppContext'
import { Navigate, Outlet } from 'react-router-dom'

export function AuthRoute(): JSX.Element {
  const { appState } = useContext(AppContext)
  const isAuthenticated = appState.user.id
  const isNotLoggedIntoClient =
    appState.user.id && !appState.client.id && appState.user.clientIds

  const auth = true
  return auth ? <Outlet /> : <Navigate to="/login" />
}
