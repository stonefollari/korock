import React from 'react'

import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import { useNavigate } from 'react-router-dom'
import Button from '@mui/material/Button'
import { useContext } from 'react'
import AppContext from '../../app/AppContext'

import AccountCircle from '@mui/icons-material/AccountCircle'
import MenuItem from '@mui/material/MenuItem'
import Menu from '@mui/material/Menu'
import Cookies from 'js-cookie'
import { logout } from '../../api/user'

export default function TopBar(): JSX.Element {
  const navigate = useNavigate()
  const { appState, appReducer } = useContext(AppContext)
  const userId = appState.user.id

  const handleNavigateHome = () => {
    navigate('/dashboard')
  }
  const handleNavigateLogin = () => {
    navigate('/login')
  }

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = async () => {
    const result = await logout()

    if (result.success) {
      appReducer({ type: 'jwt', payload: undefined })
      Cookies.remove('jwt', { path: '' })
      navigate('/login')
    }
  }
  const handleDashboard = async () => {
    navigate(`/dashboard`)
  }

  return (
    <AppBar position="static" sx={{ height: '50px' }}>
      <Toolbar variant="dense" sx={{ height: '50px' }}>
        {/* <IconButton
          edge="start"
          // className={classes.menuButton}
          color="inherit"
          aria-label="menu"
        >
          <div
            style={{
              width: 35,
              height: 35,
              borderRadius: 35,
              overflow: 'hidden',
              alignContent: 'centers',
              display: 'flex',
              position: 'relative',
            }}
          >
            <img
              src="https://i.pinimg.com/originals/0c/67/5a/0c675a8e1061478d2b7b21b330093444.gif"
              height={35}
              width={48}
              style={{
                position: 'absolute',
                top: '50%',
                right: '50%',
                transform: 'translate(50%,-50%)',
              }}
              alt={''}
            ></img>
          </div>
        </IconButton> */}
        <div
          style={{
            justifyItems: 'left',
            textAlign: 'left',
            cursor: 'pointer',
            flexGrow: 1,
          }}
          onClick={handleNavigateHome}
        >
          <Typography variant="h6">KoRock</Typography>
        </div>

        {userId ? (
          <div>
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenuClick}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={open}
              onClose={handleClose}
            >
              <MenuItem onClick={handleDashboard}>Dashboard</MenuItem>
              <MenuItem onClick={handleClose} disabled>
                Profile
              </MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </div>
        ) : (
          <Button color="inherit" onClick={handleNavigateLogin}>
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  )
}
