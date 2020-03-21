import React from 'react';
import { database } from './index';
import { TextField, Button } from '@material-ui/core';

function AddUser() {
  var username;
  var nickname;

  function addUser() {
    if (!nickname || !username) return;

    var user = {};
    user['nickname'] = nickname;
    user['username'] = username;

    const key = database.ref().child('users').push().key;
    console.log(key);
    database.ref().child('users').update({[key]: user}).catch(err => {
      console.log(err);
    });
  }

  return (
    <div>
      <div>
        <TextField
          id="username"
          label="Username"
          onChange={(e) => {
            username = e.target.value;
          }} />
      </div>
      <div>
        <TextField
          id="nickname"
          label="Nickname"
          onChange={(e) => {
            nickname = e.target.value;
          }} />
      </div>
      <div>
        <Button
          variant="contained"
          color="primary"
          onClick={addUser} >
          Add User
        </Button>
      </div>
    </div>
  )
}

export default AddUser;