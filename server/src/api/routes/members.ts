import express, { Request, Response } from 'express'
import { fail, success } from '.'
import { getMembers } from '../resolvers/members'

const memberRouter = express.Router()

memberRouter.get('/getMembers', async (req: Request, res: Response) => {
  const userId = req.userId
  const groupId = parseInt(req.query.groupId as string)
  if (!userId) {
    res.status(403).send(fail('Must be logged in.'))
    return
  }

  const members = await getMembers(groupId)
  res.status(200).send(success(members))
  return
})

export default memberRouter
