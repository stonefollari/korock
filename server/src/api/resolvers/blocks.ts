import { knex } from '../../server'
import { err } from '../../utils/functions'

import { Block, BlockMember, DataFields } from '../../database/types'
import { getUsersById } from './users'

export async function setBlock(
  block: DataFields<Block | undefined>,
  blockMembers: number[],
): Promise<Block | undefined> {
  try {
    return await knex.transaction(async (trx) => {
      const insertedBlock = await trx
        .insert(block)
        .into('Blocks')
        .returning<Block[]>('*')
        .onConflict(['name', 'groupId'])
        .merge()
        .then((rows) => rows[0])

      if (insertedBlock && blockMembers.length) {
        const users = await getUsersById(blockMembers)
        const insertBlockMembers = users?.map(
          (u): DataFields<BlockMember> => ({
            userId: u.id,
            groupId: insertedBlock.groupId,
            blockId: insertedBlock.id,
          }),
        )

        if (insertBlockMembers?.length) {
          await trx.insert(insertBlockMembers).into('BlockMembers')
        }
      }

      return insertedBlock
    })
  } catch (e) {
    err(e)
    return undefined
  }
}

export async function getBlock(
  userId: number,
  blockId: number,
): Promise<Block | undefined> {
  try {
    return await knex
      .first<Block | undefined>('Blocks.*')
      .from('Blocks')
      .leftJoin('Members', 'Members.groupId', 'Blocks.groupId')
      .leftJoin('BlockMembers', 'BlockMembers.blockId', 'Blocks.id')
      .where({ 'Blocks.id': blockId, 'Blocks.userId': userId }) // owner
      .orWhere({ 'Members.userId': userId, isPublic: true }) // public and in group
      .orWhere({
        'Members.userId': userId,
        'BlockMembers.userId': userId,
      }) // block member
  } catch (e) {
    err(e)
    return undefined
  }
}

export async function getBlocks(
  userId: number,
  groupId: number,
): Promise<Block[] | undefined> {
  try {
    return await knex
      .select<Block[]>('*')
      .from('Blocks')
      .where({ groupId, isPublic: true })
  } catch (e) {
    err(e)
    return undefined
  }
}

export async function getMemberBlocks(
  userId: number,
  groupId: number,
): Promise<Block[] | undefined> {
  try {
    return await knex
      .select<Block[]>('Blocks.*')
      .from('Blocks')
      .leftJoin('BlockMembers', 'BlockMembers.blockId', 'Blocks.id')
      .where({ 'Blocks.groupId': groupId, 'Blocks.userId': userId }) // owner
      .orWhere({ 'Blocks.groupId': groupId, isPublic: true }) // public
      .orWhere({ 'Blocks.groupId': groupId, 'BlockMembers.userId': userId }) // member
  } catch (e) {
    err(e)
    return undefined
  }
}
