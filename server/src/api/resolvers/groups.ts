import { DataFields, Group, Member, ROLES } from '../../database/types'
import { knex } from '../../server'
import { err } from '../../utils/functions'

export async function getGroup(
  userId: number,
  groupId: number,
): Promise<Group | undefined> {
  try {
    return await knex
      .first<Group>('*')
      .from('Groups')
      .where({ id: groupId, userId })
  } catch (e) {
    err(e)
    return undefined
  }
}

export async function getGroups(userId: number): Promise<Group[] | undefined> {
  try {
    return await knex
      .select<Group[]>('Groups.*')
      .from('Groups')
      .leftJoin('Members', 'Members.groupId', 'Groups.id')
      .where({ 'Members.userId': userId })
  } catch (e) {
    err(e)
    return undefined
  }
}

export async function setGroup(
  group: DataFields<Group | undefined>,
  members: Pick<DataFields<Member>, 'userId' | 'roleId'>[],
): Promise<Group | undefined> {
  try {
    return await knex.transaction(async (trx) => {
      const insertedGroup = await trx
        .insert(group)
        .from('Groups')
        .returning<Group[]>('*')
        .onConflict(['name', 'userId'])
        .merge()
        .then((rows) => rows[0])

      // add admin member for owner
      if (insertedGroup) {
        // insert owner as admin
        await trx
          .insert({
            userId: insertedGroup.userId,
            groupId: insertedGroup.id,
            roleId: ROLES.ADMIN,
          })
          .into('Members')
      }

      // add members
      if (insertedGroup && members.length) {
        await trx.insert(members).into('Members')
      }
      return insertedGroup
    })
  } catch (e) {
    err(e)
    return undefined
  }
}
