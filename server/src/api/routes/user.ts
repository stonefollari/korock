import express from 'express'
import {
  createSalt,
  passwordsMatch,
  sha256,
  validEmail,
} from '../../utils/functions'
import { fail, message, success } from '.'
import { generateToken } from '../../server/express'
import { createUser, getUser, getUserById } from '../resolvers/users'
import { getUserMembers } from '../resolvers/members'

const userRouter = express.Router()

interface CreateAccountInput {
  email: string
  password: string
  checkPassword: string
}
userRouter.post('/createAccount', async (req, res) => {
  const { email, password, checkPassword } = req.body as CreateAccountInput

  // Check valid email format
  if (!validEmail(email)) {
    res.status(400).send(fail('Email is not valid.'))
    return
  }

  const existingUser = await getUser(email)
  // User does not exist
  if (!existingUser) {
    // check pass match
    if (!passwordsMatch(password, checkPassword)) {
      res.status(400).send(fail('Passwords do not match.'))
      return
    }
    // create account
    const salt = createSalt()
    const hashPassword = await sha256(password + salt)
    const newUser = await createUser({
      email,
      password: hashPassword,
      salt,
    })

    if (!newUser) {
      res
        .status(400)
        .send(fail('Encountered error when creating user. Please try again.'))
      return
    }

    const token = generateToken({ userId: newUser.id, groupIds: [] })
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
userRouter.post('/login', async (req, res) => {
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
  const hashPassword = user.password
  const salt = user.salt

  const inputHashPassword = await sha256(password + salt)
  if (!passwordsMatch(hashPassword, inputHashPassword)) {
    res.status(200).send(fail('Incorrect password.'))
    return
  }

  // const superAdmin = await isSuperAdmin(user.id)
  const members = await getUserMembers(user.id)

  let token = {}
  // is super admin
  if (members.length > 1) {
    const groupIds = members.map((member) => member.groupId) // get groupIds
    token = generateToken({
      userId,
      groupIds: groupIds,
    })
    // just one client
  } else {
    token = generateToken({
      userId,
    })
  }

  // Success
  res.cookie('token', token, { httpOnly: true })
  res.status(200).send(success(token))
})

userRouter.post('/logout', async (req, res) => {
  res.clearCookie('token')
  res.status(200).send(message('Successfully logged out.'))
})

userRouter.get('/getUserById', async (req, res) => {
  const userId = parseInt(req.query.userId as string)
  const user = await getUserById(userId)

  if (user) {
    res.send(success(user))
    return
  } else {
    res.send(fail('No User found.'))
    return
  }
})

export default userRouter
