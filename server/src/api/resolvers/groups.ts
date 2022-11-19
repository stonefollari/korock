import { DataFields, Group, Member } from '../../database/types'
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

// export async function setGroup(
//   group: DataFields<Group | undefined>,
//   members: Pick<DataFields<Member>, 'userId' | 'roleId'>[],
// ): Promise<Group | undefined> {
//   try {
//     return await knex.transaction(async (trx) => {
//       const insertedGroup = await trx
//         .insert(group)
//         .from('Groups')
//         .returning<Group[]>('*')
//         .onConflict(['name', 'userId'])
//         .merge()
//         .then((rows) => rows[0])
//       // await trx.insert(members).into('Members')
//       return insertedGroup
//     })
//   } catch (e) {
//     err(e)
//     return undefined
//   }
// }
