import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
// Add additional properties to the Request type from express.
declare module 'express' {
  export interface Request {
    cookies: Cookies
    userId?: number
    clientId: number
    clientIds?: number[]
    isAuthenticated: boolean
    isClientUser: boolean
  }
}

type Cookies = {
  token?: string | undefined // We expect the token cookie to be set for authentication
  [key: string]: unknown
}
// Strong typing does not work it seems.
export function cookieParser(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const cookies = req.headers.cookie
  if (cookies) {
    req.cookies = cookies.split(';').reduce((obj, c) => {
      const n = c.split('=')
      obj[n[0].trim()] = n[1].trim()
      return obj
    }, {})
  }
  next()
}

export function authentication(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const token: string = req?.cookies?.token || ''
  let jwtData: JWT | undefined = undefined
  try {
    jwtData = jwt.verify(token, process.env.SIGNING_SECRET)
  } catch (e) {
    // no-op
  }

  const requestClientId: number | undefined = req.body.clientId || undefined
  req.userId = jwtData?.userId
  req.clientId = jwtData?.clientId || 0
  req.clientIds = jwtData?.clientIds
  req.isAuthenticated = !!jwtData?.userId
  req.isClientUser = !requestClientId || requestClientId === jwtData?.clientId
  next()
}

export type JWTClaims = {
  userId: number
  roleId?: number
  clientId?: number
  clientIds?: number[] // for users with multiple clients
  issuer: string
  permissions: string
}

export type JWT = {
  userId: number
  roleId: number
  clientId?: number
  clientIds?: number[]
  issuer?: string
  permissions?: string
  iat?: number
  exp?: number
}
export function generateToken({
  userId,
  clientId,
  clientIds,
  roleId,
}: {
  userId: number
  clientId?: number
  clientIds?: number[]
  roleId?: number
}): JWT {
  const EXPIRES_IN = 7 * 24 * 60 * 60 // 1 week in seconds
  const claims: JWTClaims = {
    userId: userId,
    roleId: roleId,
    clientId: clientId,
    clientIds: clientIds,
    issuer: `teamautomate`,
    permissions: `all`,
  }

  const token = jwt.sign(claims, process.env.SIGNING_SECRET, {
    expiresIn: EXPIRES_IN,
  })
  return token
}
