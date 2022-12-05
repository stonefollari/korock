import instance, { APIResult } from '.'
import { getResult } from '../utils/functions'
import { Block, DataFields } from './types'

export async function getBlocks(groupId: number): Promise<APIResult<Block[]>> {
  const blocks = await instance
    .get(`/api/block/getBlocks?groupId=${groupId}`)
    .then((res) => getResult<Block[]>(res))
  return blocks
}

export async function getMemberBlocks(
  groupId: number,
): Promise<APIResult<Block[]>> {
  const blocks = await instance
    .get(`/api/block/getMemberBlocks?groupId=${groupId}`)
    .then((res) => getResult<Block[]>(res))
  return blocks
}

export async function getBlock(
  blockId: number,
): Promise<APIResult<Block | undefined>> {
  const block = await instance
    .get(`/api/block/getBlock?blockId=${blockId}`)
    .then((res) => getResult<Block>(res))
  return block
}

export type SetBlock = Omit<DataFields<Block>, 'userId'>

export async function setBlock(
  block: SetBlock,
  blockMembers: number[],
): Promise<APIResult<Block | undefined>> {
  const newBlock = await instance
    .post(`/api/block/setBlock`, { block, blockMembers })
    .then((res) => getResult<Block>(res))
  return newBlock
}
