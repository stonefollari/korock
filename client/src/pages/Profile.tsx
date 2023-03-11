import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { User } from '../api/types'
import { getUserById } from '../api/user'
import TopBar from '../components/common/TopBar'
import { err } from '../utils/functions'

export default function Profile(): JSX.Element {
  const { userId: userIdParam } = useParams<{
    userId?: string | undefined
  }>()
  const userId = userIdParam ? parseInt(userIdParam) : 0
  const [user, setUser] = useState<User>()

  useEffect(() => {
    getUserById(userId)
      .then((res) => {
        if (res.success && res.data) {
          console.log('found user')
          setUser(res.data)
        } else {
          console.log(res.message)
        }
      })
      .catch((e) => {
        err(e)
      })
  }, [userId])

  // return real view
  return (
    <div>
      <TopBar />
      <Container sx={{ mt: 4 }}>
        <Grid container justifyContent="center" spacing={3}>
          <Grid item xs={12}>
            <Grid container justifyContent="center">
              <Typography variant="h5">Profile</Typography>
              {user && (
                <Grid container>
                  <Grid item xs={12}>
                    <Typography>User {user.email}</Typography>
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </div>
  )
}
