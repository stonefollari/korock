import React, { useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Box from '@mui/system/Box'
import { useParams } from 'react-router-dom'
import { getMemberBlocks } from '../api/block'
import { getGroup } from '../api/group'
import { Block, Group } from '../api/types'
import BlockCard from '../components/BlockCard'
import TopBar from '../components/common/TopBar'
import { err, range } from '../utils/functions'
import AddBlock from '../components/AddBlock'
import { DAY_MS } from '../utils/constants'
import { format } from 'date-fns'

export default function GroupPage(): JSX.Element {
  const { groupId: groupIdParam } = useParams<{
    groupId?: string | undefined
  }>()
  const groupId = groupIdParam ? parseInt(groupIdParam) : 0

  const [group, setGroup] = useState<Group>()
  const [blocks, setBlocks] = useState<Block[]>([])

  const [week, setWeek] = useState<Date[]>(getWeek(getMonday()))

  const handleNextWeek = () => {
    const lastDay = week[week.length - 1]
    setWeek(getWeek(new Date(lastDay.getTime() + DAY_MS)))
  }

  const handlePrevWeek = () => {
    const firstDay = week[0]
    setWeek(getWeek(new Date(firstDay.getTime() - 7 * DAY_MS)))
  }

  useEffect(() => {
    getMemberBlocks(groupId)
      .then((res) => {
        if (res.success) {
          setBlocks(res.data || [])
        } else {
          console.log(res.message)
        }
      })
      .catch((e) => err(e))
  }, [])

  useEffect(() => {
    if (groupId) {
      getGroup(groupId)
        .then((res) => {
          if (res.success) {
            setGroup(res.data)
          } else {
            console.log(res.message)
          }
        })
        .catch((e) => err(e))
    }
  }, [])

  return (
    <div
      style={{
        width: '100%',
      }}
    >
      <TopBar />
      <Container
        sx={{
          p: 0,
          m: 0,
          mt: 4,
          maxWidth: '1800px !important',
          paddingLeft: '2em !important',
          paddingRight: '2em !important',
        }}
      >
        <Grid container justifyContent="space-between">
          <Button onClick={() => handlePrevWeek()}>Prev</Button>
          <Typography variant="h5">
            {group?.name ? group?.name : 'Group'}
          </Typography>
          <Button onClick={() => handleNextWeek()}>Next</Button>
        </Grid>
        <Grid container spacing={1}>
          {week.map((day) => (
            <Grid
              key={day.getTime()}
              item
              xs={12}
              sm={12}
              md={1.714}
              sx={{ mt: 3 }}
            >
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Paper
                    elevation={0}
                    square
                    variant="outlined"
                    key={day.getTime()}
                    sx={{
                      width: '100%',
                      display: 'inline-block',
                      backgroundColor: '#f8f8f8',
                    }}
                  >
                    <Box sx={{ p: 1, textAlign: 'center' }}>
                      <Typography variant="body2">
                        {format(day, 'MM/dd')}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={2} justifyContent="center">
                    {blocks
                      .filter((block) => sameDay(block.date, day))
                      .sort((a, b) => compareDate(a.date, b.date))
                      .map((block) => (
                        <Grid item xs={12} key={block.id}>
                          <BlockCard block={block} />
                        </Grid>
                      ))}
                    <AddBlock />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          ))}
        </Grid>

        <Container>
          <Grid container justifyContent="center" spacing={3}></Grid>
        </Container>
      </Container>
    </div>
  )
}

const getWeek = (start: Date): Date[] => {
  const days = range(7).map(
    (i) => new Date(new Date(start.toDateString()).getTime() + i * DAY_MS),
  )
  return days
}

const getMonday = (): Date => {
  const date = new Date()
  const day = date.getDay() // Sunday - Saturday : 0 - 6
  //  Day of month - day of week (-6 if Sunday), otherwise +1
  const diff = date.getDate() - day + (day === 0 ? -6 : 1)
  return date.setDate(diff), date
}

const sameDay = (d1: number | undefined, date2: Date) => {
  if (!d1) {
    return undefined
  }
  const date1 = new Date(d1)
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  )
}

const compareDate = (a: number | undefined, b: number | undefined) => {
  if (!a && !b) {
    return 0
  }
  if (!a) {
    return -1
  }
  if (!b) {
    return 1
  }

  const dateA = new Date(a)
  const dateB = new Date(b)
  return dateB.getTime() - dateA.getTime()
}
