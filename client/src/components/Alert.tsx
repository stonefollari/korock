import React from 'react'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert from '@mui/material/Alert'
import { APIResult } from '../api'

type AlertSeverity = 'success' | 'warning' | 'error' | 'info'
export type AlertInput = {
  open: boolean
  severity?: AlertSeverity
  message?: string | undefined
}

interface AlertProps {
  alert: AlertInput
  onClose?: () => void
}

export default function Alert({ alert, onClose }: AlertProps): JSX.Element {
  const handleClose = () => {
    onClose?.()
  }

  return (
    <Snackbar
      open={alert.open}
      autoHideDuration={5000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <MuiAlert
        onClose={handleClose}
        severity={alert.severity || 'info'}
        elevation={6}
        variant="filled"
      >
        {alert.message || ''}
      </MuiAlert>
    </Snackbar>
  )
}

export function handleAlert(
  alert: React.Dispatch<React.SetStateAction<AlertInput>>,
  res: APIResult,
  message: string,
): void {
  if (res?.success) {
    alert({
      open: true,
      message,
      severity: 'success',
    })
  } else {
    alert({
      open: true,
      message: res?.message || 'Error',
      severity: 'error',
    })
  }
}
