import { knex } from '../../server'
import { err } from '../../utils/functions'

import { Block, DataFields } from '../../database/types'

export async function createBlock(
  block: DataFields<Block | undefined>,
): Promise<Block | undefined> {
  try {
    return await knex
      .insert(block)
      .from('Blocks')
      .returning<Block[]>('*')
      .then((rows) => rows[0])
  } catch (e) {
    err(e)
    return undefined
  }
}
