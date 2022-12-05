import { Typography } from '@mui/material'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import React, { useEffect, useState } from 'react'
import { getGroups } from '../api/group'
import { Group } from '../api/types'
import AddGroup from '../components/AddGroup'
import TopBar from '../components/common/TopBar'
import GroupCard from '../components/GroupCard'
import { err } from '../utils/functions'

export default function Dashboard(): JSX.Element {
  const [groups, setGroups] = useState<Group[]>([])
  useEffect(() => {
    getGroups()
      .then((res) => {
        if (res.success) {
          setGroups(res.data || [])
        } else {
          console.log(res.message)
        }
      })
      .catch((e) => err(e))
  }, [])

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
              <Typography variant="h5">Dashboard</Typography>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container justifyContent="center" spacing={8}>
              {groups.length ? (
                groups.map((group) => (
                  <Grid item key={group.name}>
                    <GroupCard group={group}></GroupCard>
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Grid container justifyContent="center">
                    <Typography>
                      It looks like you do not belong to any groups. Ask someone
                      for an invite, or create one below.
                    </Typography>
                  </Grid>
                </Grid>
              )}
              <AddGroup />
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </div>
  )
}
