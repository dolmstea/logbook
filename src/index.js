import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import store from './app/store';
import { Provider } from 'react-redux';
import * as serviceWorker from './serviceWorker';

import firebase from 'firebase/app';
import 'semantic-ui-css/semantic.min.css';

const firebaseConfig = {
  apiKey: "AIzaSyCwqRdCcP5CJLJRhhwIYEwHM-YlQ6S_YDI",
  authDomain: "logbook-df657.firebaseapp.com",
  databaseURL: "https://logbook-df657.firebaseio.com",
  projectId: "logbook-df657",
  storageBucket: "logbook-df657.appspot.com",
  messagingSenderId: "636958337199",
  appId: "1:636958337199:web:a3510839bc5eb1ab0e0c5a"
};

firebase.initializeApp(firebaseConfig);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
