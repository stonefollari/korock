import { knex } from '../../server'
import { err } from '../../utils/functions'

import { DataFields, Member, User } from '../../database/types'

export async function setMembers(
  members: DataFields<Member>[],
): Promise<Member[] | undefined> {
  try {
    return await knex
      .insert(members)
      .into('Members')
      .returning<Member[]>('*')
      .onConflict(['userId', 'groupId', 'roleId'])
      .merge()
  } catch (e) {
    err(e)
    return undefined
  }
}

export async function getMember(
  userId: number,
  groupId: number,
): Promise<Member | undefined> {
  try {
    return await knex
      .first<Member | undefined>('*')
      .from('Members')
      .where({ groupId, userId })
  } catch (e) {
    err(e)
    return undefined
  }
}

export type GetMember = Member &
  Omit<DataFields<User>, 'biography' | 'salt' | 'password'>
export async function getMembers(
  groupId: number,
): Promise<GetMember[] | undefined> {
  try {
    return await knex
      .select<GetMember[]>([
        'Members.*',
        'Users.email',
        'Users.name',
        'Users.nickname',
      ])
      .from('Members')
      .leftJoin('Users', 'Users.id', 'Members.userId')
      .where({ groupId })
  } catch (e) {
    err(e)
    return undefined
  }
}

export async function removeMember(
  userId: number,
  groupId: number,
): Promise<number | undefined> {
  try {
    return await knex('Members').del().where({ userId, groupId })
  } catch (e) {
    err(e)
    return undefined
  }
}

export async function getUserMembers(userId: number): Promise<Member[]> {
  try {
    return await knex.select<Member[]>('*').from('Members').where({ userId })
  } catch (e) {
    err(e)
    return []
  }
}
