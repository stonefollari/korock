import instance, { APIResult } from '.'
import { getResult } from '../utils/functions'
import { DataFields, Group, Member } from './types'

export async function getGroups(): Promise<APIResult<Group[]>> {
  const groups = await instance
    .get('/api/group/getGroups')
    .then((res) => getResult<Group[]>(res))
  return groups
}

export async function getGroup(
  groupId: number,
): Promise<APIResult<Group | undefined>> {
  const group = await instance
    .get(`/api/group/getGroup?groupId=${groupId}`)
    .then((res) => getResult<Group>(res))
  return group
}

export async function getGroupPreview(
  groupId: number,
  token: string,
): Promise<APIResult<Group | undefined>> {
  const group = await instance
    .get(`/api/group/getGroupPreview?groupId=${groupId}&token=${token}`)
    .then((res) => getResult<Group>(res))
  return group
}

export type SetGroup = Omit<DataFields<Group | undefined>, 'userId'>
export async function setGroup(
  group: SetGroup,
  members: Pick<DataFields<Member>, 'userId' | 'roleId'>[],
): Promise<APIResult<Group | undefined>> {
  const newGroup = await instance
    .post('/api/group/setGroup', { group, members })
    .then((res) => getResult<Group>(res))
  return newGroup
}
