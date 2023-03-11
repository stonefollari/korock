import React, { useEffect, useState } from 'react'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import TopBar from '../components/common/TopBar'
import { useContext } from 'react'
import AppContext from '../app/AppContext'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Group } from '../api/types'
import { getGroupPreview } from '../api/group'
import { err, wait } from '../utils/functions'
import { confirmMember } from '../api/members'
import Alert, { AlertInput, handleAlert } from '../components/Alert'

export default function JoinGroup(): JSX.Element {
  const navigate = useNavigate()
  const useQuery = () => new URLSearchParams(useLocation().search)
  const query = useQuery()
  const token = query.get('token')

  const { groupId: groupIdParam } = useParams<{
    groupId?: string | undefined
  }>()
  const groupId = groupIdParam ? parseInt(groupIdParam) : 0

  const { appState } = useContext(AppContext)
  const userId = appState.user.id

  const [loading, setLoading] = useState<boolean>(true)
  const [group, setGroup] = useState<Group | undefined>()
  const [alert, setAlert] = useState<AlertInput>({ open: false })

  useEffect(() => {
    if (!token) {
      return
    }

    getGroupPreview(groupId, token)
      .then((res) => {
        if (res.success && res.data) {
          setGroup(res.data)
        } else {
          // setAlert
        }
      })
      .catch((e) => err(e))
    setLoading(false)
  }, [groupId, token])

  const handleLogIn = () => {
    navigate(`/login?redir=/joinGroup/${groupId}?token=${token}`)
  }

  const handleJoin = () => {
    if (!token) {
      setAlert({
        open: true,
        message: 'No token found. Try again later.',
        severity: 'error',
      })
      return
    }

    confirmMember(groupId, token)
      .then(async (res) => {
        handleAlert(setAlert, res, 'Successfully joined group. Redirecting...')
        await wait(2000)
        navigate(`/group/${groupId}`)
      })
      .catch((e) => err(e))
  }

  return (
    <div
      style={{
        width: '100%',
      }}
    >
      <TopBar />
      <Container sx={{ mt: 4 }}>
        <Grid container justifyContent="center" spacing={3}>
          <Grid item xs={12}>
            <Grid container justifyContent="center">
              <Typography variant="h5">Join KoRock Group</Typography>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container justifyContent="center" spacing={8}>
              <Grid item xs={12}>
                {!userId && (
                  <Grid container justifyContent="center" spacing={2}>
                    <Grid item xs={12}>
                      <Typography textAlign="center">
                        You are not logged in. Log in or create an account
                        below.
                      </Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <Grid container justifyContent="center">
                        <Button variant="contained" onClick={handleLogIn}>
                          Log In
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                )}
                {userId && group && (
                  <Grid container justifyContent="center" spacing={3}>
                    <Grid item xs={12}>
                      <Typography textAlign="center">
                        You have been invited to join {group.name}.
                      </Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <Grid container justifyContent="center">
                        <Button variant="contained" onClick={handleJoin}>
                          Join
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                )}
                {!group && !loading && (
                  <Grid container justifyContent="center">
                    <Grid item xs={12}>
                      <Typography textAlign="center">
                        Error: Group not found.
                      </Typography>
                    </Grid>
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
      <Alert
        alert={alert}
        onClose={() => setAlert({ ...alert, open: false })}
      />
    </div>
  )
}
