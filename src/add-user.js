import React, { useState } from 'react';
import './add-user.css';

import { database } from './index';
import { Button,
  Snackbar,
  TextField,
 } from '@material-ui/core';

function AddUser() {
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);
  const [nickname, setNickname] = useState('');
  const [username, setUsername] = useState('');

  const addUser = () => {
    if (!nickname || !username) {
      setMessage('Unable to add user');
      setOpen(true);
      return;
    }

    var user = {};
    user['nickname'] = nickname;
    user['username'] = username;
    
    const key = database.ref().child('users').push().key;
    database.ref().child('users').update({[key]: user}).then(() => {
      setMessage(`Added user: ${username}, nick: ${nickname}!`);
      setOpen(true);
    }).catch(err => {
      console.log(err);
    });
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  }

  return (
    <div className="addUser">
      <div>
        <TextField
          id="username"
          label="Username"
          onChange={(e) => {
            setUsername(e.target.value);
          }} />
      </div>
      <div>
        <TextField
          id="nickname"
          label="Nickname"
          onChange={(e) => {
            setNickname(e.target.value);
          }} />
      </div>
      <div className="center-button">
        <Button
          className="user-button"
          variant="contained"
          color="primary"
          onClick={addUser} >
          Add User
        </Button>
      </div>
      <Snackbar autoHideDuration={5000} open={open} message={message} onClose={handleClose}>
      </Snackbar>
    </div>
  )
}

export default AddUser;