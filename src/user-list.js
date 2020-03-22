import React from 'react';
import './user-list.css';
import { Card,
  CardHeader,
  IconButton,
  Grid,
  CardContent} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

function UserList(props) {
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
                title={`Hi ${user.val.username}!`}
                action={
                  <IconButton aria-label="settings" onClick={() => props.handleDeleteClick(user)}>
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