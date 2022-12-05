import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import * as React from 'react'
import { useNavigate } from 'react-router-dom'

export default function AddBlock(): JSX.Element {
  const navigate = useNavigate()
  return (
    <Grid item xs={12}>
      <Grid container justifyContent="center">
        <Button
          variant="outlined"
          onClick={() => navigate('/createBlock')}
          size="small"
          sx={{ borderRadius: 50, minWidth: 0, width: 30.75 }}
        >
          +
        </Button>
      </Grid>
    </Grid>
  )
}
