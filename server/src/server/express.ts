import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
// Add additional properties to the Request type from express.

declare module 'express' {
  export interface Request {
    cookies: Cookies
    userId: number | undefined
    groupIds: number[] | undefined // groups you are authenticated with
    roleId: number | undefined // admin view or member view
    isGroupMember: boolean // if req.groupId, does jwt match
    isAuthenticated: boolean // does userId exist in jwt, logged in
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

  const requestedGroupId: number | undefined = req.body.clientId || undefined
  req.userId = jwtData?.userId
  req.groupIds = jwtData?.groupIds
  req.roleId = jwtData?.roleId
  req.isAuthenticated = !!jwtData?.userId
  req.isGroupMember =
    jwtData?.groupIds && requestedGroupId
      ? jwtData.groupIds.includes(requestedGroupId)
      : false
  next()
}

export type JWTClaims = {
  userId: number
  groupIds: number[]
  roleId?: number
  issuer: string
  permissions: string
}

export type JWT = {
  userId: number
  groupIds: number[]
  roleId: number
  issuer?: string
  permissions?: string
  iat?: number
  exp?: number
}
export function generateToken({
  userId,
  groupIds,
  roleId,
}: {
  userId: number
  groupIds?: number[]
  roleId?: number
}): JWT {
  const EXPIRES_IN = 7 * 24 * 60 * 60 // 1 week in seconds
  const claims: JWTClaims = {
    userId: userId,
    groupIds: groupIds || [],
    roleId: roleId,
    issuer: `korock`,
    permissions: `all`,
  }

  const token = jwt.sign(claims, process.env.SIGNING_SECRET, {
    expiresIn: EXPIRES_IN,
  })
  return token
}
