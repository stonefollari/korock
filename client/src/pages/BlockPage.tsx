import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getBlock } from '../api/block'
import { Block } from '../api/types'
import TopBar from '../components/common/TopBar'
import Component from '../components/Component'
import { err } from '../utils/functions'

export default function BlockPage(): JSX.Element {
  const { blockId: blockIdParam } = useParams<{
    blockId?: string | undefined
  }>()
  const blockId = blockIdParam ? parseInt(blockIdParam) : 0

  const [block, setBlock] = useState<Block>()
  useEffect(() => {
    if (blockId) {
      getBlock(blockId)
        .then((res) => {
          if (res.success) {
            setBlock(res.data)
          } else {
            console.log(res.message)
          }
        })
        .catch((e) => err(e))
    }
  }, [blockId])

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
            <Grid item xs={12}>
              Submissions: {block.allowSubmission ? 'Yes' : 'No'}
            </Grid>
            <Grid item xs={12}>
              Comments: {block.allowComment ? 'Yes' : 'No'}
            </Grid>
            <Grid item xs={12}>
              Anonymous: {block.allowAnonymous ? 'Yes' : 'No'}
            </Grid>
          </Grid>
        </Component>
      </Container>
      <Box p={30}></Box>
    </div>
  )
}
