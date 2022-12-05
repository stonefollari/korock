import express, { Request, Response } from 'express'
import { fail, success } from '.'
import { Block, DataFields } from '../../database/types'
import {
  getBlock,
  getBlocks,
  getMemberBlocks,
  setBlock,
} from '../resolvers/blocks'

const blockRouter = express.Router()

blockRouter.get('/getBlocks', async (req: Request, res: Response) => {
  const userId = req.userId
  const groupId = parseInt(req.query.groupId as string)

  if (!userId) {
    res.status(403).send(fail('Must be logged in.'))
    return
  }

  const groups = await getBlocks(userId, groupId)
  res.status(200).send(success(groups))
  return
})

blockRouter.get('/getMemberBlocks', async (req: Request, res: Response) => {
  const userId = req.userId
  const groupId = parseInt(req.query.groupId as string)

  if (!userId) {
    res.status(403).send(fail('Must be logged in.'))
    return
  }

  const groups = await getMemberBlocks(userId, groupId)
  res.status(200).send(success(groups))
  return
})

blockRouter.get('/getBlock', async (req: Request, res: Response) => {
  const userId = req.userId
  const blockId = parseInt(req.query.blockId as string)

  if (!userId) {
    res.status(403).send(fail('Must be logged in.'))
    return
  }

  const group = await getBlock(userId, blockId)
  res.status(200).send(success(group))
  return
})

export type SetBlock = Omit<DataFields<Block>, 'userId'>

interface SetBlockInput {
  block: SetBlock
  blockMembers: number[]
}
blockRouter.post('/setBlock', async (req: Request, res: Response) => {
  const userId = req.userId
  const { block, blockMembers } = req.body as SetBlockInput
  if (!userId) {
    res.status(403).send(fail('Must be logged in.'))
    return
  }

  const fullBlock: DataFields<Block> = {
    ...block,
    userId,
    date: block.date ? new Date(block.date) : undefined,
  }
  const newBlock = await setBlock(fullBlock, blockMembers)
  res.status(200).send(success(newBlock))
  return
})

export default blockRouter
