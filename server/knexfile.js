// load env vars in development
if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('dotenv').config()
}

module.exports = {
  development: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL,
    seeds: {
      directory: './migrations/seeds',
    },
    ssl: {
      rejectUnauthorized: false,
    },
  },

  staging: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10,
    },
    seeds: {
      directory: './migrations/seeds',
    },
    migrations: {
      tableName: 'knex_migrations',
    },
    ssl: {
      rejectUnauthorized: false,
    },
  },

  production: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
    ssl: {
      rejectUnauthorized: false,
    },
  },
}
