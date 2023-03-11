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
      .leftJoin('Members', 'Members.groupId', 'Groups.id')
      .where({
        'Groups.id': groupId,
        'Members.userId': userId,
        confirmed: true,
      })
  } catch (e) {
    err(e)
    return undefined
  }
}

export async function getGroupPreview(
  groupId: number,
  token?: string,
  userId?: number,
): Promise<Group | undefined> {
  try {
    return await knex
      .first<Group>('*')
      .from('Groups')
      .leftJoin('Members', 'Members.groupId', 'Groups.id')
      .where({ 'Groups.id': groupId, 'Members.userId': userId })
      .orWhere({
        'Groups.id': groupId,
        'Members.token': token,
        confirmed: false,
      })
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
  invites: string[],
): Promise<{ group: Group; members: Member[] } | undefined> {
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
      let adminMember: Member | undefined = undefined
      if (insertedGroup) {
        // insert owner as admin
        adminMember = await trx
          .insert<Member>({
            userId: insertedGroup.userId,
            groupId: insertedGroup.id,
            roleId: ROLES.ADMIN,
            confirmed: true,
            joined: new Date(),
          })
          .into('Members')
          .returning('*')
          .then((rows) => rows[0])
      }

      // add members
      let insertedMembers: Member[] = adminMember ? [adminMember] : []
      if (insertedGroup && members.length) {
        const invitedMembers = await trx
          .insert<Member[]>(
            members.map((member) => ({
              userId: member.userId,
              roleId: member.roleId,
              groupId: insertedGroup.id,
              confirmed: false,
              token: undefined,
            })),
          )
          .into('Members')
          .returning('*')

        insertedMembers = insertedMembers.concat(invitedMembers)
      }
      return { group: insertedGroup, members: insertedMembers }
    })
  } catch (e) {
    err(e)
    return undefined
  }
}
