import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './app';

import firebase from 'firebase/app';
import 'firebase/database';

const config = {
  apiKey: process.env.REACT_APP_FB_API_KEY,
  databaseURL: process.env.REACT_APP_FB_DB_URL,
};

const app = firebase.initializeApp(config);
export const database = app.database();

ReactDOM.render(<App />, document.getElementById('root'));