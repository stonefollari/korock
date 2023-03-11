import React, { useContext, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import jwt from 'jsonwebtoken'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Container from '@mui/material/Container'
import { createAccount, login } from '../api/user'
import Alert, { AlertInput } from '../components/Alert'
import AppContext, { JWT } from '../app/AppContext'
import { isValidEmail } from '../utils/functions'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import TopBar from '../components/common/TopBar'

export default function Login(): JSX.Element {
  const useQuery = () => new URLSearchParams(useLocation().search)
  const query = useQuery()
  const redir = query.get('redir')

  const { appReducer } = useContext(AppContext)
  const navigate = useNavigate()
  const [alert, setAlert] = useState<AlertInput>({ open: false })
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [checkPassword, setCheckPassword] = useState<string>('')

  const [isLogin, setIsLogin] = useState<boolean>(true)

  const handleSubmit = async () => {
    if (isLogin) {
      await handleLogin()
    } else {
      await handleCreateAccount()
    }
  }

  const handleLogin = async () => {
    // check email and password again
    if (!password) {
      setAlert({
        open: true,
        severity: 'error',
        message: 'Insert password.',
      })
      return
    }
    if (!email || !isValidEmail(email)) {
      setAlert({
        open: true,
        severity: 'error',
        message: 'Invalid email.',
      })
    } else {
      const result = await login(email, password)

      if (result.success) {
        const jwtData = jwt.decode(result.data || '') as JWT
        appReducer({ type: 'jwt', payload: jwtData })

        if (redir) {
          navigate(redir)
        } else {
          navigate('/dashboard')
        }
      } else {
        setAlert({
          open: true,
          severity: 'error',
          message: result.message,
        })
      }
    }
  }

  const handleCreateAccount = async () => {
    // check email and password again
    if (!password || !checkPassword) {
      setAlert({
        open: true,
        severity: 'error',
        message: 'Password and Check Password are required.',
      })
      return
    }
    if (!email || !isValidEmail(email)) {
      setAlert({
        open: true,
        severity: 'error',
        message: 'Invalid email.',
      })
    } else {
      const result = await createAccount(email, password, checkPassword)

      if (result.success) {
        const jwtData = jwt.decode(result.data || '') as JWT
        appReducer({ type: 'jwt', payload: jwtData })

        navigate('/dashboard')
      } else {
        setAlert({
          open: true,
          severity: 'error',
          message: result.message,
        })
      }
    }
  }

  return (
    <div
      style={{
        width: '100%',
      }}
    >
      <TopBar />
      <Container sx={{ mt: 4 }}>
        <Grid container spacing={2} justifyContent="center">
          {isLogin ? (
            <>
              <Grid item xs={12}>
                <Typography>Login</Typography>
              </Grid>
              <Grid item xs={12}>
                <Stack justifyContent="center">
                  <TextField
                    size="small"
                    label="Email"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack justifyContent="center">
                  <TextField
                    size="small"
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Stack>
              </Grid>
            </>
          ) : (
            <>
              <Grid item xs={12}>
                <Typography>Create Account</Typography>
              </Grid>
              <Grid item xs={12}>
                <Stack justifyContent="center">
                  <TextField
                    size="small"
                    label="Email"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Stack>
              </Grid>

              <Grid item xs={12}>
                <Stack justifyContent="center">
                  {' '}
                  <TextField
                    size="small"
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack justifyContent="center">
                  <TextField
                    size="small"
                    label="Check Password"
                    type="password"
                    value={checkPassword}
                    onChange={(e) => setCheckPassword(e.target.value)}
                  />
                </Stack>
              </Grid>
            </>
          )}
          <Grid item xs={12}>
            <Stack justifyContent="center">
              <Button onClick={handleSubmit}>Submit</Button>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack justifyContent="center">
              <Button onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? 'Create Account' : 'Already Have Account'}
              </Button>
            </Stack>
          </Grid>
        </Grid>

        <Alert
          alert={alert}
          onClose={() => setAlert({ ...alert, open: false })}
        />
      </Container>
    </div>
  )
}
