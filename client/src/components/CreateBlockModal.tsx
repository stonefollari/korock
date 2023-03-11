import React, { useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Container from '@mui/material/Container'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField, { TextFieldProps } from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { SetBlock, setBlock } from '../api/block'
import { getGroups } from '../api/group'
import { Block, Group } from '../api/types'
import { err, wait } from '../utils/functions'
import { format } from 'date-fns'
import { DesktopDatePicker } from '@mui/x-date-pickers'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { DAY_MS } from '../utils/constants'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import Box from '@mui/material/Box'
import Alert, { AlertInput, handleAlert } from '../components/Alert'
import { Autocomplete, FormHelperText } from '@mui/material'
import { GetMember, getMembers } from '../api/members'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'

export interface CreateBlockModalProps {
  open: boolean
  onClose: () => void
  edit?: Block
}

export default function CreateBlockModal({
  open,
  onClose,
  edit,
}: CreateBlockModalProps): JSX.Element {
  const editDate = edit?.date ? new Date(edit.date) : defaultTime

  const [alert, setAlert] = useState<AlertInput>({ open: false })
  const [groups, setGroups] = useState<Group[]>([])
  const [members, setMembers] = useState<GetMember[]>()
  const [selectedGroupId, setSelectedGroupId] = useState<number | undefined>()
  const [name, setName] = useState<string>(edit?.name || '')
  const [isPublic, setIsPublic] = useState<boolean>(edit?.isPublic || true)
  const [date, setDate] = useState<Date>(editDate)
  const [time, setTime] = useState<Date>(editDate)
  const [meetingUrl, setMeetingUrl] = useState<string>(edit?.meetingUrl || '')
  const [videoUrl, setVideoUrl] = useState<string>(edit?.videoUrl || '')
  const [imageUrl, setImageUrl] = useState<string>(edit?.imageUrl || '')
  const [details, setDetails] = useState<string>(edit?.details || '')
  const [allowSubmission, setAllowSubmission] = useState<boolean>(
    edit?.allowSubmission || false,
  )
  const [allowComment, setAllowComment] = useState<boolean>(
    edit?.allowComment || false,
  )
  const [allowAnonymous, setAllowAnonymous] = useState<boolean>(
    edit?.allowAnonymous || false,
  )
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))

  useEffect(() => {
    getGroups()
      .then((res) => {
        if (res.success && res.data) {
          setGroups(res.data)
          setSelectedGroupId(res.data[0]?.id)
        } else {
          setAlert({ open: true, severity: 'error', message: res.message })
        }
      })
      .catch((e) => err(e))
  }, [])

  useEffect(() => {
    if (selectedGroupId) {
      getMembers(selectedGroupId)
        .then((res) => {
          console.log(res)
          if (res.success && res.data) {
            setMembers(res.data)
          } else {
            setAlert({ open: true, severity: 'error', message: res.message })
          }
        })
        .catch((e) => err(e))
    }
  }, [selectedGroupId])

  const handleSubmit = () => {
    if (!selectedGroupId) {
      return
    }

    if (!name) {
      setAlert({
        open: true,
        severity: 'warning',
        message: 'Block must have a name.',
      })
      return
    }

    const dateTime = new Date(date || new Date())
    dateTime.setHours(time.getHours())
    dateTime.setMinutes(time.getMinutes())
    dateTime.setSeconds(time.getSeconds())
    dateTime.setMilliseconds(0)

    const block: SetBlock = {
      groupId: selectedGroupId,
      name,
      details,
      meetingUrl,
      videoUrl,
      imageUrl,
      date: dateTime.getTime(),

      isPublic,
      allowSubmission,
      allowComment,
      allowAnonymous,
    }

    const blockMembers = members?.map((m) => m.id) || []

    setBlock(block, blockMembers)
      .then(async (res) => {
        handleAlert(
          setAlert,
          res,
          `Successfully ${edit ? 'updated' : 'created'} block. Redirecting...`,
        )
        await wait(1000)
        onClose()
      })
      .catch((e) => err(e))
  }

  const getSelectedGroup = (): Group | undefined => {
    return groups?.find((group) => group.id === selectedGroupId)
  }

  const getDaysBetween = (date1: Date, date2: Date): number => {
    return Math.ceil((date1.getTime() - date2.getTime()) / DAY_MS)
  }

  const groupStartDate = new Date(getSelectedGroup()?.date || new Date())

  return (
    <div>
      <Dialog
        open={open}
        fullWidth={true}
        maxWidth={'lg'}
        fullScreen={fullScreen}
      >
        <div
          style={{
            width: '100%',
          }}
        >
          <Container sx={{ mt: 4 }}>
            {groups.length ? (
              <Grid container justifyContent="center" spacing={3}>
                <Grid item xs={12}>
                  <Grid container justifyContent="center">
                    <Typography variant="h5">
                      {edit ? 'Edit' : 'Create'} Block
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Grid container justifyContent="center" spacing={3}>
                    <Grid item xs={12}>
                      <Grid container justifyContent="center" spacing={3}>
                        <Grid item xs={12} md={6}>
                          <FormControl fullWidth>
                            <InputLabel id="select-group-label">
                              Group
                            </InputLabel>
                            <Select
                              value={selectedGroupId}
                              size="small"
                              label="Group"
                              fullWidth
                              onChange={(e) =>
                                setSelectedGroupId(e.target.value as number)
                              }
                            >
                              {groups.map((group) => (
                                <MenuItem key={group.id} value={group.id}>
                                  {group.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Grid container justifyContent="center">
                            <FormGroup>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={isPublic}
                                    onChange={() => setIsPublic(!isPublic)}
                                  />
                                }
                                label="Public"
                              />
                              <FormHelperText>
                                {isPublic
                                  ? 'Visable to entire group.'
                                  : 'Only visable to shared users.'}
                              </FormHelperText>
                            </FormGroup>
                          </Grid>
                        </Grid>
                        {!isPublic && (
                          <Grid item xs={12} md={6}>
                            <Autocomplete
                              multiple
                              limitTags={2}
                              size="small"
                              id="multiple-limit-tags"
                              options={members || []}
                              getOptionLabel={(option) => option.email}
                              defaultValue={[]}
                              fullWidth
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Share"
                                  disabled={isPublic}
                                  fullWidth
                                  helperText="Chose who to share with. Leave empty for a private block."
                                />
                              )}
                            />
                          </Grid>
                        )}
                      </Grid>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        value={name}
                        label="Block Name"
                        size="small"
                        fullWidth
                        onChange={(e) => setName(e.target.value)}
                      ></TextField>
                    </Grid>
                    <Grid item xs={12}>
                      <Grid container justifyContent="center" spacing={4}>
                        <Grid item sm={6} xs={12}>
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DesktopDatePicker
                              value={date}
                              onChange={(d: Date | null) =>
                                setDate(d || groupStartDate)
                              }
                              renderInput={(params: TextFieldProps) => (
                                <TextField
                                  {...params}
                                  label="Date"
                                  size="small"
                                  fullWidth
                                  helperText={`Date is stored relative to Group Start (${
                                    format(groupStartDate, 'MM/dd/yyyy') ||
                                    'Unknown'
                                  }). ${
                                    date
                                      ? `Day ${getDaysBetween(
                                          date,
                                          groupStartDate,
                                        )}`
                                      : ''
                                  }`}
                                />
                              )}
                            />
                          </LocalizationProvider>
                        </Grid>
                        <Grid item sm={6} xs={12}>
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <TimePicker
                              value={time}
                              onChange={(d: Date | null) =>
                                setTime(d || defaultTime)
                              }
                              renderInput={(params: TextFieldProps) => (
                                <TextField
                                  {...params}
                                  label="Time"
                                  size="small"
                                  fullWidth
                                />
                              )}
                            />
                          </LocalizationProvider>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        value={meetingUrl}
                        label="Meeting Link"
                        size="small"
                        fullWidth
                        onChange={(e) => setMeetingUrl(e.target.value)}
                      ></TextField>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        value={videoUrl}
                        label="Video Link"
                        size="small"
                        fullWidth
                        onChange={(e) => setVideoUrl(e.target.value)}
                      ></TextField>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        value={imageUrl}
                        label="Image Link"
                        size="small"
                        fullWidth
                        onChange={(e) => setImageUrl(e.target.value)}
                      ></TextField>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        value={details}
                        label="Details and Description"
                        size="small"
                        fullWidth
                        multiline
                        rows={16}
                        onChange={(e) => setDetails(e.target.value)}
                      ></TextField>
                    </Grid>
                    <Grid item xs={12}>
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Checkbox
                              value={allowSubmission}
                              checked={allowSubmission}
                              onChange={() =>
                                setAllowSubmission(!allowSubmission)
                              }
                            />
                          }
                          label="Submissions"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              value={allowComment}
                              checked={allowComment}
                              onChange={() => {
                                if (allowComment) {
                                  setAllowAnonymous(false)
                                }
                                setAllowComment(!allowComment)
                              }}
                            />
                          }
                          label="Comments"
                        />
                        {allowComment ? (
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={allowAnonymous}
                                value={allowAnonymous}
                                onChange={() =>
                                  setAllowAnonymous(!allowAnonymous)
                                }
                              />
                            }
                            label="Anonymous Comments"
                          />
                        ) : null}
                      </FormGroup>
                    </Grid>
                    <Grid item xs={12}>
                      <Grid container justifyContent="space-between">
                        <Button variant="contained" onClick={onClose}>
                          Cancel
                        </Button>
                        <Button variant="contained" onClick={handleSubmit}>
                          {edit ? 'Update' : 'Create'}
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            ) : (
              <Grid>
                Did not find any groups. You must own a group to create a block.
              </Grid>
            )}
          </Container>
          <Alert
            alert={alert}
            onClose={() => setAlert({ ...alert, open: false })}
          />
          <Box p={30}></Box>
        </div>
      </Dialog>
    </div>
  )
}

const defaultTime = new Date()
defaultTime.setHours(9)
defaultTime.setMinutes(0)
defaultTime.setSeconds(0)
defaultTime.setMilliseconds(0)
