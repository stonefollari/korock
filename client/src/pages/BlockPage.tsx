import React, { useEffect, useState } from 'react'
import { Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import { format } from 'date-fns'
import { useParams } from 'react-router-dom'
import { getBlock } from '../api/block'
import { Block } from '../api/types'
import TopBar from '../components/common/TopBar'
import Component from '../components/Component'
import { err } from '../utils/functions'
import { useContext } from 'react'
import AppContext from '../app/AppContext'
import CreateBlockModal from '../components/CreateBlockModal'

export default function BlockPage(): JSX.Element {
  const { blockId: blockIdParam } = useParams<{
    blockId?: string | undefined
  }>()
  const blockId = blockIdParam ? parseInt(blockIdParam) : 0
  const { appState } = useContext(AppContext)
  const [block, setBlock] = useState<Block | undefined>()
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false)
  const isOwner = block && block.userId === appState.user.id

  useEffect(() => {
    if (blockId) {
      getBlock(blockId)
        .then((res) => {
          if (res.success && res.data) {
            setBlock(res.data)
          } else {
            console.log(res.message)
          }
        })
        .catch((e) => err(e))
    }
  }, [blockId])

  const handleEdit = () => {
    // open edit modal
    setEditModalOpen(true)
  }

  const handleEditClose = () => {
    // open edit modal
    setEditModalOpen(false)
  }

  const getEmbedUrl = (url?: string): string | undefined => {
    if (!url) {
      return undefined
    }
    const r1 = new RegExp(/youtube.com\/watch\?v=([a-zA-Z0-9]+)/gim)
    const r2 = new RegExp(/youtu.be\/([a-zA-Z0-9]+)/gim)
    const m1 = r1.exec(url)
    const m2 = r2.exec(url)
    const match = m1 || m2
    const videoId = match?.[1]

    return videoId ? `https://www.youtube.com/embed/${videoId}` : undefined
  }

  if (!block) {
    return <div>Loading</div>
  }

  return (
    <div
      style={{
        width: '100%',
      }}
    >
      <TopBar />
      <Container sx={{ mt: 4 }}>
        <Component title={block.name}>
          <Grid container justifyContent="center" spacing={4}>
            <Grid item xs={12}>
              {isOwner && (
                <Button variant="contained" onClick={handleEdit}>
                  Edit
                </Button>
              )}
            </Grid>
            <Grid item xs={12}>
              <Grid container justifyContent="center">
                <Grid item xs={12}>
                  <Typography variant="body2">Group {block.groupId}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2">
                    {block.date && format(new Date(block.date), 'h:mma')}
                  </Typography>
                  <Typography variant="body2">
                    {block.date &&
                      format(new Date(block.date), 'eeee MMM dd, yyyy')}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            {block.videoUrl && getEmbedUrl(block.videoUrl) ? (
              <Grid item xs={12}>
                <Grid container justifyContent="center">
                  <div
                    style={{
                      position: 'relative',
                      paddingBottom: '56.25%',
                      height: 0,
                      paddingTop: '25px',
                      width: '100%',
                    }}
                  >
                    <iframe
                      src={getEmbedUrl(block.videoUrl)}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                      }}
                    ></iframe>
                  </div>
                </Grid>
              </Grid>
            ) : null}

            {block.imageUrl ? (
              <Grid item xs={12}>
                <Grid container justifyContent="center">
                  <img
                    src={block.imageUrl}
                    alt={''}
                    style={{
                      width: '100%',
                      borderRadius: 3,
                    }}
                  />
                </Grid>
              </Grid>
            ) : null}

            <Grid item xs={12}>
              <TextField
                value={block.details}
                size="small"
                fullWidth
                multiline
                rows={16}
                InputProps={{
                  readOnly: true,
                }}
              ></TextField>
            </Grid>
            {block.meetingUrl ? (
              <Grid item xs={12}>
                <Grid container justifyContent="center">
                  <Button
                    variant="outlined"
                    onClick={() =>
                      window.open(block.meetingUrl, '_blank')?.focus()
                    }
                  >
                    Open Meeting
                  </Button>
                </Grid>
              </Grid>
            ) : null}
            {block.allowSubmission && (
              <Grid item xs={12}>
                <Grid container justifyContent="center">
                  <Typography variant="h6">Submissions</Typography>
                </Grid>
                <Typography>Submissions are currently unavailable.</Typography>
              </Grid>
            )}

            {block.allowComment && (
              <Grid item xs={12}>
                <Grid container justifyContent="center">
                  <Typography variant="h6">
                    {block.allowAnonymous ? 'Anonymous ' : ''}Comments
                  </Typography>
                </Grid>
                <Typography>Comments are currently unavailable.</Typography>
              </Grid>
            )}
          </Grid>
        </Component>
      </Container>
      <Box p={30}></Box>
      <CreateBlockModal
        open={editModalOpen}
        onClose={handleEditClose}
        edit={block}
      />
    </div>
  )
}
