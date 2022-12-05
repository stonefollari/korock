import React, { useState } from 'react'
import { DesktopDatePicker } from '@mui/x-date-pickers'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import { useNavigate } from 'react-router-dom'
import { SetGroup, setGroup } from '../api/group'
import Alert, { AlertInput } from '../components/Alert'
import TopBar from '../components/common/TopBar'
import { err, wait } from '../utils/functions'
import Typography from '@mui/material/Typography'
import TextField, { TextFieldProps } from '@mui/material/TextField'
import Button from '@mui/material/Button'

export default function CreateGroup(): JSX.Element {
  const navigate = useNavigate()
  const [alert, setAlert] = useState<AlertInput>({ open: false })
  const [name, setName] = useState<string>('')
  const [date, setDate] = useState<Date>()
  const [details, setDetails] = useState<string>('')
  const [invites, setInvites] = useState<string>('')

  const handleSubmit = () => {
    const group: SetGroup = {
      name,
      details,
      date,
    }

    setGroup(group, [])
      .then(async (res) => {
        if (res.success) {
          setAlert({
            open: true,
            severity: 'success',
            message: 'Successfully created group. Navigating to Dashboard...',
          })
          await wait(1000)
          navigate('/dashboard')
        } else {
          setAlert({
            open: true,
            severity: 'error',
            message: res.message,
          })
        }
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
              <Typography variant="h5">Create Group</Typography>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container justifyContent="center" spacing={3}>
              <Grid item xs={12}>
                <TextField
                  value={name}
                  label="Group Name"
                  size="small"
                  fullWidth
                  onChange={(e) => setName(e.target.value)}
                ></TextField>
              </Grid>
              <Grid item xs={12}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DesktopDatePicker
                    value={date}
                    onChange={(d: Date | null) => setDate(d || undefined)}
                    renderInput={(params: TextFieldProps) => (
                      <TextField
                        {...params}
                        label="Start Date"
                        size="small"
                        fullWidth
                        helperText={
                          'This is the base date for all blocks in this group.'
                        }
                      />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  value={details}
                  label="Details and Description"
                  size="small"
                  fullWidth
                  multiline
                  rows={8}
                  onChange={(e) => setDetails(e.target.value)}
                ></TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  value={invites}
                  label="Invites"
                  size="small"
                  fullWidth
                  onChange={(e) => setInvites(e.target.value)}
                  helperText={
                    'Emails to invite to group. Comma separated values.'
                  }
                ></TextField>
              </Grid>
              <Grid item xs={12}>
                <Grid container justifyContent="flex-end">
                  <Button variant="contained" onClick={handleSubmit}>
                    Create
                  </Button>
                </Grid>
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
