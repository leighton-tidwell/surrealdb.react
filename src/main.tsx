import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Surreal from 'surrealdb.js';
import { DatabaseProvider } from 'lib';

const db = new Surreal('http://127.0.0.1:8000/rpc');

ReactDOM.render(
  <DatabaseProvider database={db} options={{ user: 'root', pass: 'root', namespace: 'test', database: 'test' }}>
    <App />
  </DatabaseProvider>,
  document.getElementById('root'),
);
