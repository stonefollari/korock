import User from './User'
import Group from './Group'
import Member from './Member'
import Block from './Block'
import Submission from './Submission'
import Comment from './Comment'

// remove typical database fields that do not contain "data" about the type
export type DataFields<T> = Omit<ObjectFields<T>, 'id'>
export type ObjectFields<T> = Omit<T, 'active' | 'createdAt' | 'updatedAt'>

export enum ROLES {
  SUPER_ADMIN = 1,
  ADMIN = 2,
  MANAGER = 3,
  MEMBER = 4,
  GUEST = 5,
}

export type { User, Group, Member, Block, Submission, Comment }
