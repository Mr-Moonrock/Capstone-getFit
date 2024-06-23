import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes-nav/AppRoutes';
import { UserProvider } from './UserContext';

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
