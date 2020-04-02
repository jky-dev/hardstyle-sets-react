import React from 'react';
import './login.css';
import { auth, googleProvider } from './index';
import { Button, } from '@material-ui/core';

const Login = () => {
  const loginWithGoogle = () => {
    auth.signInWithPopup(googleProvider).then(result => {
      console.log('Logged in with Google');
    }).catch(err => {
      console.log(err);
    });
  }

  const logout = () => {
    auth.signOut().then(() => {
      console.log('Logged out');
    }).catch(err => {
      console.log(err);
    })
  }

  return (
    <div>
      <div className="login-button">
        {sessionStorage.getItem('user')
          ? <div>
              <Button
                onClick={() => logout()} >
                Logout
              </Button>
            </div>
          : <div>
              <Button
                onClick={() => loginWithGoogle()} >
                Login
              </Button>
            </div>
          }
      </div>
    </div>
  )
}

export default Login;