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

/**
 * Functional React component for displaying alert messages based on different conditions.
 * This component can render error alerts, information alerts, or success alerts based on the props provided.
 * 
 * @component
 * @param {ErrorAlertProps} props - Props for configuring the alert.
 * @param {string | null} props.message - The message to be displayed within the alert.
 * @param {boolean} [props.error=false] - If true, displays an error-themed alert.
 * @param {boolean} [props.info=false] - If true, displays an info-themed alert.
 * @param {React.ReactNode} [props.children] - Optional children to be included in the alert component.
 * @returns {React.ReactElement | null} The Alert component or null if no message is provided.
 */

const SetAlert: React.FC<ErrorAlertProps> = ({ message, error, info = false }) => {
  const [open, setOpen] = useState(true);

  /**
 * Handles the closing of the Material-UI Popover.
 * 
 * @param {React.Dispatch<React.SetStateAction<HTMLElement | null>>} setAnchorEl - The setter function from useState for controlling Popover's anchor element.
 */

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


/**
 * Functional React component for displaying a Material-UI Popover on mouse over.
 * This component is typically used to provide additional information (like a tooltip) when hovering over an element.
 * 
 * @component
 * @param {ErrorAlertProps} props - Props for configuring the popover content and its children.
 * @param {string | null} props.message - The message to be displayed inside the popover.
 * @param {React.ReactNode} props.children - The trigger element that the popover is attached to.
 * @returns {React.ReactElement} The Popover component.
 */

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

/**
 * Handles the opening of the Material-UI Popover by setting the anchor element based on mouse event.
 * 
 * @param {React.MouseEvent<HTMLElement>} event - The mouse event that triggered the popover opening.
 * @param {React.Dispatch<React.SetStateAction<HTMLElement | null>>} setAnchorEl - The setter function from useState for controlling Popover's anchor element.
 */

const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>, setAnchorEl: any) => {
    setAnchorEl(event.currentTarget);
};

export  {
    SetAlert,
    MouseOverPopover, 
    handlePopoverOpen
};
