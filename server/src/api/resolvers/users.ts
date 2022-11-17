import { knex } from '../../server'
import { err } from '../../utils/functions'
import { User, Member, ROLES, ObjectFields } from '../../database/types'

/**
 * Fetches user based on email
 * @param email
 * @param options unsafe: fetches all fields, including pass
 * @returns User | undefined
 */
export async function getUser(
  email: string,
  options?: { unsafe: boolean },
): Promise<User | undefined> {
  if (!email) return undefined

  const attributes = options?.unsafe
    ? ['id', 'email', 'name', 'salt', 'pass']
    : ['id', 'email', 'name']

  try {
    return knex.first<User>(attributes).from('Users').where({ email })
  } catch (e) {
    err(e)
  }
}

/**
 * Fetches user based on email
 * @param id
 * @param options unsafe: fetches all fields, including pass
 * @returns User | undefined
 */
export async function getUserById(
  id: string,
  options?: { unsafe: boolean },
): Promise<User | undefined> {
  if (!id) return undefined

  const attributes = options?.unsafe
    ? ['id', 'email', 'name', 'salt', 'pass']
    : ['id', 'email', 'name']

  try {
    return knex.first<User>(attributes).from('Users').where({ id })
  } catch (e) {
    err(e)
  }
}

export async function isSuperAdmin(userId: number): Promise<boolean> {
  try {
    const result = await knex
      .first<Member | undefined>('*')
      .from('Members')
      .where({ userId, roleId: ROLES.SUPER_ADMIN })
    return !!result
  } catch (e) {
    err(e)
  }
  return false
}

export async function createUser(
  user: Pick<User, 'email' | 'password' | 'salt'>,
): Promise<User | undefined> {
  try {
    await knex.insert(user).into('Users')
    return getUser(user.email)
  } catch (e) {
    err(e)
  }
}

export async function deleteUser(userId: number): Promise<number | undefined> {
  try {
    return await knex('Users').where({ id: userId }).del()
  } catch (e) {
    err(e)
  }
}

export async function updateUser(
  user: ObjectFields<User>,
): Promise<User | undefined> {
  try {
    return await knex
      .insert(user)
      .into('Users')
      .onConflict(['id', 'email'])
      .merge()
      .returning<User[]>('*')
      .then((rows) => rows[0])
  } catch (e) {
    err(e)
  }
}

export async function getMembers(userId: number): Promise<Member[]> {
  try {
    return await knex.select<Member[]>('*').from('Members').where({ userId })
  } catch (e) {
    err(e)
    return []
  }
}
