import express, { Request, Response } from 'express'
import { fail, success } from '.'
import { confirmMember, getMembers } from '../resolvers/members'

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

interface ConfirmMemberInput {
  groupId: number
  token: string
}

memberRouter.post('/confirmMember', async (req: Request, res: Response) => {
  const userId = req.userId
  const { groupId, token } = req.body as ConfirmMemberInput
  if (!userId) {
    res.status(403).send(fail('Must be logged in.'))
    return
  }

  const confirmed = await confirmMember(userId, groupId, token)
  if (confirmed) {
    res.status(200).send(success(confirmed))
  } else {
    res.status(400).send(fail('Failed to join group.'))
  }
  return
})

export default memberRouter
