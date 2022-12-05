import * as React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { Block } from '../api/types'
import { useNavigate } from 'react-router-dom'

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
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {block.name}
        </Typography>
        <Typography variant="body2">{block.details}</Typography>
      </CardContent>
    </Card>
  )
}
