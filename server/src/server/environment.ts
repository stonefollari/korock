/**
 * Load Environment Variables.
 */
if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('dotenv').config()
}

const requiredEnvs = [process.env.DATABASE_URL]

if (requiredEnvs.some((env) => env === undefined)) {
  throw new Error('Error: Required environment variables missing.')
}

export default {}
