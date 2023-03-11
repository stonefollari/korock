import instance, { APIResult } from '.'
import { getResult } from '../utils/functions'
import { DataFields, Member, User } from './types'

export type GetMember = Member &
  Omit<DataFields<User>, 'biography' | 'salt' | 'password'>
export async function getMembers(
  groupId: number,
): Promise<APIResult<GetMember[]>> {
  const members = await instance
    .get(`/api/member/getMembers?groupId=${groupId}`)
    .then((res) => getResult<GetMember[]>(res))
  return members
}

export async function confirmMember(
  groupId: number,
  token: string,
): Promise<APIResult<boolean>> {
  return await instance
    .post('/api/member/confirmMember', { groupId, token })
    .then((res) => getResult<boolean>(res))
}
