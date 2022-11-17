import { Group } from '../../database/types'
import { knex } from '../../server'
import { err } from '../../utils/functions'

export async function getGroups(userId: number): Promise<Group[]> {
  try {
    return await knex.select<Group[]>('*').from('Groups').where({ userId })
  } catch (e) {
    err(e)
    return []
  }
}
