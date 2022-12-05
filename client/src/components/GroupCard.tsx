import * as React from 'react'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { Group } from '../api/types'
import { useNavigate } from 'react-router-dom'
import { stringColor } from '../utils/functions'

export default function GroupCard({ group }: { group: Group }): JSX.Element {
  const navigate = useNavigate()
  const handleClick = (groupId: number) => {
    navigate(`/group/${groupId}`)
  }

  return (
    <Card sx={{ width: 275 }}>
      <CardMedia
        component="img"
        height="140"
        sx={{ backgroundColor: stringColor(group.name) }}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {group.displayName || group.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {group.details}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={() => handleClick(group.id)}>
          Open
        </Button>
      </CardActions>
    </Card>
  )
}
