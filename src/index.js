import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './app';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const config = {
  apiKey: process.env.REACT_APP_FB_API_KEY,
  databaseURL: process.env.REACT_APP_FB_DB_URL,
  authDomain: process.env.REACT_APP_FB_AUTH_DOMAIN,
};

const app = firebase.initializeApp(config);
export const database = app.database();
export const googleProvider = new firebase.auth.GoogleAuthProvider();
export const auth = app.auth();

ReactDOM.render(<App />, document.getElementById('root'));