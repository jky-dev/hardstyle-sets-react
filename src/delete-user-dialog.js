import React from 'react';
import { Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import { database } from './index';

function DeleteUserDialog(props) {

  const handleDeleteUser = () => {
    database.ref('/users').child(props.user.key).remove().then(() => {
      console.log(`Removed user ${props.user.key}`);
    }).catch(err => {
      console.log(err);
    });
    props.handleClose();
  }

  return (
    <Dialog
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{`Delete user ${props.user.val.username}?`}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Deleting {props.user.val.username} will remove its existence... forever. Are you sure?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleClose} color="primary">
          No
        </Button>
        <Button onClick={handleDeleteUser} color="primary" autoFocus>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteUserDialog;