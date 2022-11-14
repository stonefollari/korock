import knexInit, { Knex } from 'knex'
import { log } from '../../utils/functions'

export default function connect(): Knex {
  let knex
  try {
    knex = knexInit({
      client: 'postgresql',
      connection: process.env.DATABASE_URL || '',
    })
    log('Connected to postgres.')
  } catch (e) {
    throw new Error(
      `Could not connect to database. Error: ${(e as Error).message}`,
    )
  }
  return knex
}
