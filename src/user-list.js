import React from 'react';
import './user-list.css';
import { Card,
  CardHeader,
  IconButton,
  Grid,
  CardContent} from '@material-ui/core';

import DeleteIcon from '@material-ui/icons/Delete';

function UserList(props) {
  const handleDeleteClick = (key) => {
    console.log('delete', key);
  }

  return (
    <div>
      <Grid
        container
        direction="row"
        justify="space-evenly"
        alignItems="flex-start"
        spacing={2}
      >
        {props.users.map(user =>
          <Grid item key={user.key}>
            <Card>
              <CardHeader
                title={`Welcome ${user.val.username}`}
                action={
                  <IconButton aria-label="settings" onClick={() => handleDeleteClick(user.key)}>
                    <DeleteIcon />
                  </IconButton>
                } />
                <CardContent>
                  otherwise known as {user.val.nickname}
                </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </div>
  )
}

export default UserList;