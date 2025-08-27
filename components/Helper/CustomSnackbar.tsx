'use client';

import React from 'react';
import { Snackbar, Alert, AlertColor } from '@mui/material';

interface CustomSnackbarProps {
  open: boolean;
  onClose: () => void;
  message?: string;
  severity?: AlertColor; // 'success' | 'error' | 'info' | 'warning'
}

const CustomSnackbar: React.FC<CustomSnackbarProps> = ({
  open,
  onClose,
  message = 'Успешно!',
  severity = 'success',
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default CustomSnackbar;
