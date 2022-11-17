import React from 'react'
import Cookies from 'js-cookie'
import { ROLES } from '../types'

type IdNamePair = {
  id: number | undefined
  name?: string
}

type UserState = {
  id?: number
  name?: string
  roleId?: ROLES
  clientIds?: number[]
}

export type JWT = {
  userId?: number
  roleId?: ROLES
  clientId?: number
  clientIds?: number[]
  issuer?: string
  permissions?: string
  iat?: number
  exp?: number
}

type AppState = {
  client: IdNamePair
  user: UserState
  jwt: JWT
}

type Action = {
  type: string
  // TODO add generic
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any
}

type AppContextValue = {
  appState: AppState
  appReducer: React.Dispatch<Action>
}

export function jwtExpires(jwt?: JWT): number {
  if (!jwt) return 0
  return jwt.exp && jwt.iat ? jwt.exp - jwt.iat : 7 * 24 * 60 * 60 // 1 week default
}

const defaultJWT: JWT = JSON.parse(Cookies.get('jwt') || '{}')
const clientId = defaultJWT.clientId
const clientIds = defaultJWT.clientIds
const userId = defaultJWT.userId
const roleId = defaultJWT.roleId
export const defaultAppState: AppState = {
  client: {
    id: clientId,
  },
  user: {
    id: userId,
    roleId,
    clientIds,
  },
  jwt: defaultJWT,
}

export function appStateReducer(appState: AppState, action: Action): AppState {
  const { type, payload } = action

  switch (type) {
    case 'client':
      return { ...appState, client: payload }
    case 'user':
      return { ...appState, user: payload }
    case 'jwt':
      return updateJWT(appState, payload)
    default:
      throw new Error()
  }
}

const defaultValue: AppContextValue = {
  appState: defaultAppState,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  appReducer: ({ type, payload }) => {
    return
  },
}

function updateJWT(appState: AppState, newJWT: JWT | undefined): AppState {
  const clientId = newJWT?.clientId
  const clientIds = newJWT?.clientIds
  const userId = newJWT?.userId
  const roleId = newJWT?.roleId

  // set cookies of new jwt payload
  // This is secure since we are not storing the entire token, which is needed for verification.
  Cookies.set('jwt', JSON.stringify(newJWT), {
    expires: jwtExpires(newJWT),
  })
  return {
    client: {
      ...appState.client,
      id: clientId,
    },
    user: {
      ...appState.user,
      id: userId,
      roleId,
      clientIds,
    },
    jwt: newJWT || {},
  }
}

const AppContext = React.createContext(defaultValue)

export default AppContext
