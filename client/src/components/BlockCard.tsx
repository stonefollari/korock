import * as React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { Block } from '../api/types'
import { useNavigate } from 'react-router-dom'
import Grid from '@mui/material/Grid'

export default function BlockCard({ block }: { block: Block }): JSX.Element {
  const navigate = useNavigate()
  const handleClick = (blockId: number) => {
    navigate(`/block/${blockId}`)
  }

  return (
    <Card
      sx={{ minWidth: 100, cursor: 'pointer' }}
      onClick={() => handleClick(block.id)}
      elevation={0}
      variant="outlined"
    >
      <CardContent sx={{ p: 1 }}>
        <Grid container justifyContent="center">
          <Typography gutterBottom>{block.name}</Typography>
        </Grid>
        <Typography variant="body2" color="text.secondary">
          {block.details}
        </Typography>
      </CardContent>
    </Card>
  )
}
