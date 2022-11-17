import express, { Request, Response } from 'express'
import {
  createSalt,
  passwordsMatch,
  sha256,
  validEmail,
} from '../../utils/functions'
import { fail, message, success } from '../'
import { generateToken } from '../../server/express'
import { Group, ROLES } from '../../database/types'
import { createUser, getMembers, getUser, isSuperAdmin } from '../resolvers/users'
import { getGroups } from '../resolvers/groups'

const accountRouter = express.Router()

interface CreateAccountInput {
  email: string
  password: string
  checkPassword: string
}
accountRouter.post('/createAccount', async (req, res) => {
  const { email, password, checkPassword } = req.body as CreateAccountInput

  // Check valid email format
  if (!validEmail(email)) {
    res.status(200).send('Email is not valid.')
    return
  }

  const existingUser = await getUser(email)
  // User does not exist
  if (!existingUser) {
    // check pass match
    if (!passwordsMatch(password, checkPassword)) {
      res.status(200).send(fail('Passwords do not match.'))
      return
    }
    // create account
    const salt = createSalt()
    const hashPass = await sha256(password + salt)
    const newUser = await createUser({
      email,
      password: hashPass,
      salt,
    })

    if (!newUser) {
      res
        .status(200)
        .send(fail('Encountered error when creating user. Please try again.'))
      return
    }

    const token = generateToken({ userId: newUser.id })
    res.cookie('token', token, { httpOnly: true })
    res.status(200).send(success(token))
    // TODO: add JWT token creation, return
  } else {
    res.status(200).send(fail('User with email already exists.'))
  }
})

interface LoginInput {
  email: string
  password: string
}
accountRouter.post('/login', async (req, res) => {
  const { email, password } = req.body as LoginInput

  const user = await getUser(email, { unsafe: true }) // unsafe fetches all feilds

  // No user for email
  if (!user) {
    res
      .status(200)
      .send(
        fail(
          'That email does not belong to an account. Consider creating an account below.',
        ),
      )
    return
  }

  // Check password
  const userId = user.id
  const hashPass = user.password
  const salt = user.salt

  const inputHashPass = await sha256(password + salt)
  if (!passwordsMatch(hashPass, inputHashPass)) {
    res.status(200).send(fail('Incorrect password.'))
    return
  }

  const superAdmin = await isSuperAdmin(user.id)
  const members = await getMembers(user.id)

  let token = {}
  // is super admin
  if (superAdmin) {
    token = generateToken({
      userId,
      roleId: ROLES.SUPER_ADMIN,
    })
    // user has multiple client roles
  } else if (members.length > 1) {
    const groupIds = members.map((member) => member.groupId) // get groupIds
    token = generateToken({
      userId,
      clientIds: groupIds,
    })
    // just one client
  } else if (members.length === 1) {
    const member = members[0]
    token = generateToken({
      userId,
      clientId: member.groupId,
      roleId: member.roleId,
    })
    // no client
  } else {
    token = generateToken({
      userId,
    })
  }

  // Success
  res.cookie('token', token, { httpOnly: true })
  res.status(200).send(success(token))
})

/* API:account.logout */
accountRouter.post('/logout', async (req, res) => {
  res.clearCookie('token')
  res.status(200).send(message('Successfully logged out.'))
})

interface ClientLoginInput {
  clientLoginId: number // not named clientId to avoid apiAuth handler to prevent request.
}
/* API:account.clientLogin */
accountRouter.post('/clientLogin', async (req: Request, res: Response) => {
  const { clientLoginId } = req.body as ClientLoginInput
  const userId = req.userId

  if (!userId || !clientLoginId) {
    res.status(200).send(fail('Invalid attempt to log in to client.'))
    return
  }
  const superAdmin = await isSuperAdmin(userId)
  const members = await getMembers(userId)
  const member = members.find((role) => role.groupId === clientLoginId)
  let token = {}

  // if has client attempting to log in to
  if (superAdmin) {
    // sign in to that client
    token = generateToken({
      userId,
      clientId: clientLoginId,
      roleId: ROLES.SUPER_ADMIN,
    })
  } else if (member) {
    // sign in to that client
    token = generateToken({
      userId,
      clientId: member.groupId,
      roleId: member.roleId,
    })
  } else {
    res.status(200).send(fail('Attempted to sign in to invalid client.'))
    return
  }
  // Success
  res.cookie('token', token, { httpOnly: true })
  res.status(200).send(success(token))
})

/* API:account.getUserClients */
accountRouter.get('/getUserClients', async (req: Request, res: Response) => {
  const userId = req.userId

  if (!userId) {
    res.status(200).send(fail('Must be logged in.'))
    return
  }

  const superAdmin = await isSuperAdmin(userId)
  const clientIds = (await getMembers(userId)).map((member) => member.groupId)

  let groups: Group[] | undefined = undefined
  // groups = await getGroups(clientId)

  return res.status(200).send(success(groups))
})

// Add edit account features

export default accountRouter
