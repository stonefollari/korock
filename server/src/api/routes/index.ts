import express, { NextFunction, Request, Response } from 'express'
import userRouter from './user'
import groupRouter from './group'
import blockRouter from './block'
import memberRouter from './members'

export type APIResult = {
  success: boolean
  data: unknown | unknown[] | undefined
  message?: string | ''
}

export const success = (
  data?: unknown | unknown[] | undefined,
  message = '',
): APIResult => ({
  success: true,
  data: data,
  message,
})

export const message = (message = ''): APIResult => ({
  success: true,
  data: undefined,
  message,
})
export const fail = (message = '', data?: unknown | undefined): APIResult => ({
  success: false,
  data: data || undefined,
  message,
})

export const apiRouter = express.Router()

export function apiAuth(req: Request, res: Response, next: NextFunction): void {
  if (!req.groupIds?.length || !req.isGroupMember) {
    res.status(401).send(fail('Unauthorized.'))
    return
  } else {
    next()
  }
}

apiRouter.use('/user', userRouter)
apiRouter.use('/member', memberRouter)
apiRouter.use('/group', groupRouter)
apiRouter.use('/block', blockRouter)

apiRouter.get('/ping', async (req, res) => {
  res.send('pong')
})
