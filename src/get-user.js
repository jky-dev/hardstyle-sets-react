import React, { useState } from 'react';
import './get-user.css';
import DeleteUserDialog from './delete-user-dialog';
import UserList from './user-list';
import { Button } from '@material-ui/core';

import { database } from './index';

const GetUser = () => {
  const [userList, setUserList] = useState([]);
  const [openDialog, setDialogOpen] = useState(false);
  const [user, setUser] = useState({
    key: '',
      val: { 
        username: '', 
        nickname: '',
      }
    }
  );

  const handleDialogClose = () => {
    setDialogOpen(false);
  }

  const handleDeleteClick = (user) => {
    setUser(user);
    setDialogOpen(true);
    console.log('delete', user);
  }

  const getUsers = () => {
    if (userList.length !== 0) {
      setUserList([]);
      return;
    }

    database.ref('/users').on('value', snapshot => {
      var users = [];
      snapshot.forEach(user => {
        const userObj = {
          key: user.key,
          val: user.val(),
        };
        users.push(userObj);
      });
      setUserList(users);
    });
  }

  return (
    <div className="getUser">
      <div className="getUserButton">
        <Button
          className="user-button"
          variant="contained"
          color="primary"
          onClick={() => getUsers()}>
          {userList.length === 0 ? 'Show Users' : 'Hide Users'}
        </Button>
      </div>
      <UserList
        users={userList}
        handleDeleteClick={handleDeleteClick} />
      <DeleteUserDialog open={openDialog} handleClose={handleDialogClose} user={user}/>
    </div>
  )
}

export default GetUser;