import axios from 'axios'

const DEFAULT_SERVER_PORT = 3000 // client default host, this will act as nothing happened.
const serverPort = parseInt(
  process.env.REACT_APP_SERVER_PORT || `${DEFAULT_SERVER_PORT}`,
)
// Set baseURL. This allows us to point to the server from the client build.
// Normally, the client is handled and served as part of the web server - so the ports are the same.
// Here, we point the client to a different port, specifically the server port.
const baseURL =
  process.env.NODE_ENV === 'development'
    ? `http://localhost:${serverPort}`
    : undefined

const instance = axios.create({
  baseURL,
  withCredentials: true,
})

// export function isAuthenticated(req): boolean {
//   return false
// }

export type APIResult<T = unknown> = {
  success: boolean
  data: T | undefined
  message?: string | ''
}

export default instance
