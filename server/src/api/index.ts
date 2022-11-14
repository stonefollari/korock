import express, { NextFunction, Request, Response } from 'express'

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
  if (!req.clientId || !req.isClientUser) {
    res.status(401).send(fail('Unauthorized.'))
    return
  } else {
    next()
  }
}

apiRouter.get('/helloWorld', async (req, res) => {
  res.send('hello world')
})
