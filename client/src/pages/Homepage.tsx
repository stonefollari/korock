import React from 'react'
import Grid from '@mui/material/Grid'
import { Typography } from '@mui/material'

export default function Homepage(): JSX.Element {
  return (
    <div>
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h6">Homepage</Typography>
        </Grid>
      </Grid>
    </div>
  )
}
