import express, { Request, Response } from 'express'
import { fail, success } from '.'
import { DataFields, Group, Member } from '../../database/types'
import {
  getGroup,
  getGroupPreview,
  getGroups,
  setGroup,
} from '../resolvers/groups'

const groupRouter = express.Router()

groupRouter.get('/getGroups', async (req: Request, res: Response) => {
  const userId = req.userId

  if (!userId) {
    res.status(403).send(fail('Must be logged in.'))
    return
  }

  const groups = await getGroups(userId)
  res.status(200).send(success(groups))
  return
})

groupRouter.get('/getGroup', async (req: Request, res: Response) => {
  const userId = req.userId
  const groupId = parseInt(req.query.groupId as string)

  if (!userId) {
    res.status(403).send(fail('Must be logged in.'))
    return
  }

  const group = await getGroup(userId, groupId)
  res.status(200).send(success(group))
  return
})

groupRouter.get('/getGroupPreview', async (req: Request, res: Response) => {
  const userId = req.userId
  const token = req.query.token as string
  const groupId = parseInt(req.query.groupId as string)

  const group = await getGroupPreview(groupId, token, userId)
  res.status(200).send(success(group))
  return
})

interface SetGroupInput {
  group: Omit<DataFields<Group | undefined>, 'userId'>
  members: Pick<DataFields<Member>, 'userId' | 'roleId'>[]
  invites: Pick<DataFields<Member>, 'userId' | 'roleId'>[]
}
groupRouter.post('/setGroup', async (req: Request, res: Response) => {
  const userId = req.userId
  const { group, members } = req.body as SetGroupInput
  const groupWithUser = { ...group, userId }
  if (!userId) {
    res.status(403).send(fail('Must be logged in.'))
    return
  }

  const newGroup = await setGroup(groupWithUser, members, [])
  res.status(200).send(success(newGroup))
  return
})

export default groupRouter
