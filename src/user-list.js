import React from 'react';

function UserList(props) {
  return (
    <div>
      {props.users.map(user =>
        <div key={user.key}>
          <h2>Welcome {user.val.username}!</h2>
          <p>otherwise known as {user.val.nickname}</p>
        </div>
      )}
    </div>
  )
}

export default UserList;