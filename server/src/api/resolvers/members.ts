import { knex } from '../../server'
import { createSalt, err } from '../../utils/functions'

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

export async function confirmMember(
  userId: number,
  groupId: number,
  token: string,
): Promise<boolean> {
  // set confirmed to true where
  const updated = await knex('Members').update({ confirmed: true }).where({
    userId,
    groupId,
    token,
  })

  return !!updated
}

export async function revokeInvite(
  userId: number,
  groupId: number,
): Promise<void> {
  await knex('Members')
    .update({ token: undefined })
    .where({
      userId,
      groupId,
    })
    .del()
}

export async function updateInvite(
  userId: number,
  groupId: number,
): Promise<void> {
  await knex('Members')
    .update({ token: createSalt() })
    .where({
      userId,
      groupId,
    })
    .del()
}
