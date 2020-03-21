import React, { useState } from 'react';
import UserList from './user-list';
import { Button } from '@material-ui/core';

import { database } from './index';

function GetUser() {
  const [userList, setUserList] = useState([]);

  function getUsers() {
    database.ref('/users').once('value').then(function(snapshot) {
      var users = [];
      snapshot.forEach(user => {
        const userObj = {
          key: user.key,
          val: user.val(),
        };
        users.push(userObj);
      });
      setUserList(users);
    }).catch(err => {
      console.log(err);
    })
  }

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        onClick={getUsers}>
        Get Users
      </Button>
      <UserList users={userList} />
    </div>
  )
}

export default GetUser;