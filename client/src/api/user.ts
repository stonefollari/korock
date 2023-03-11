import instance, { APIResult } from '.'
import { err, getResult, sha256 } from '../utils/functions'
import { User } from './types'

export async function createAccount(
  email: string,
  password: string,
  checkPassword: string,
): Promise<APIResult<string>> {
  const hashPassword = await sha256(password)
  const hashCheckPassword = await sha256(checkPassword)

  return instance
    .post('/api/user/createAccount', {
      email,
      password: hashPassword,
      checkPassword: hashCheckPassword,
    })
    .catch((e) => err(e))
    .then((res) => getResult<string>(res))
}

export async function login(
  email: string,
  password: string,
): Promise<APIResult<string>> {
  const hashPassword = await sha256(password)

  return instance
    .post('/api/user/login', {
      email,
      password: hashPassword,
    })
    .catch((e) => err(e))
    .then((res) => getResult<string>(res))
}

export async function logout(): Promise<APIResult<string>> {
  return instance
    .post('/api/user/logout')
    .catch((e) => err(e))
    .then((res) => getResult<string>(res))
}

export async function getUserById(userId: number): Promise<APIResult<User>> {
  return instance
    .get(`/api/user/getUserById`, {
      params: {
        userId,
      },
    })
    .catch((e) => err(e))
    .then((res) => getResult<User>(res))
}
