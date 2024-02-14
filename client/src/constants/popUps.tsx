import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import React, { useState } from 'react';

interface ErrorAlertProps {
  message: string | null;
  error?: boolean;
  info?: boolean;
  children?: React.ReactNode
}

const SetAlert: React.FC<ErrorAlertProps> = ({ message, error, info = false }) => {
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      {open && message && message.length > 0 && (
        <>
          {error ? (
            <Alert icon={<ErrorIcon fontSize="inherit" />} severity="error" onClose={handleClose}>
              {message}
            </Alert>
          ) : (
            <Alert icon={<CheckIcon fontSize="inherit" />} severity="success" onClose={handleClose}>
              {message}
            </Alert>
          )}
          {info && (
            <Alert icon={<InfoIcon fontSize="inherit" />} severity="info" onClose={handleClose}>
              {message}
            </Alert>
          )}
        </>
      )}
    </>
  );
};

const handlePopoverClose = (setAnchorEl: any) => {
    setAnchorEl(null);
};

const MouseOverPopover: React.FC<ErrorAlertProps> = ({ message, children }) => {
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  
    const open = Boolean(anchorEl);
  
    return (
      <>
        <Popover
          id="mouse-over-popover"
          sx={{
            pointerEvents: 'none',
          }}
          open={open}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          onClose={() =>handlePopoverClose(setAnchorEl)}
          disableRestoreFocus
        > 
          {children}
          <Typography sx={{ p: 1 }}>{message}</Typography>
        </Popover>
      </>
    );
}

const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>, setAnchorEl: any) => {
    setAnchorEl(event.currentTarget);
};

export  {
    SetAlert,
    MouseOverPopover, 
    handlePopoverOpen
};
