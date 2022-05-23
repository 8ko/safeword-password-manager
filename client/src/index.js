import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter as Router } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider } from './context/AuthProvider'
// import { disableReactDevTools } from '@fvilers/disable-react-devtools';
import App from './App';

// disable react dev tools extension in browser for security
// if (process.env.NODE_ENV === 'production') {
// disableReactDevTools();
// }

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <Router>
        <App />
      </Router>
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

