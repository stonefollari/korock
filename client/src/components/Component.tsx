import React from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

interface ComponentProps {
  title?: string | JSX.Element
  height?: number | string
  children?: React.ReactNode
  p?: number
}

export default function Component({
  title,
  height,
  children,
  p = 2,
}: ComponentProps): JSX.Element {
  return (
    <Box
      sx={{
        backgroundColor: '#fefefe',
        height: height || 'inherit',
        border: '1px solid #ddd',
        borderRadius: 3,
        overflow: 'hidden',
      }}
    >
      {title && (
        <Grid container justifyContent="center">
          <Typography
            variant="h6"
            sx={{
              padding: '16px',
              paddingBottom: '0px',
            }}
          >
            {title}
          </Typography>
        </Grid>
      )}
      <Box p={p}>{children}</Box>
    </Box>
  )
}

export function ComponentDense({
  title,
  height,
  children,
  p = 0,
}: ComponentProps): JSX.Element {
  return (
    <Box
      sx={{
        backgroundColor: '#fefefe',
        height: height || 'inherit',
        border: '1px solid #ddd',
        borderRadius: 3,
        overflow: 'hidden',
      }}
    >
      {title && (
        <Grid container justifyContent="center">
          <Typography
            variant="h6"
            sx={{
              padding: '16px',
              paddingBottom: '0px',
            }}
          >
            {title}
          </Typography>
        </Grid>
      )}
      <Box p={p}>{children}</Box>
    </Box>
  )
}
