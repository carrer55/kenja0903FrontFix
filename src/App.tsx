import React from 'react';
import AuthWrapper from './components/AuthWrapper';
import { AuthProvider } from './contexts/AuthContext';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <AuthWrapper />
    </AuthProvider>
  );
}

export default App;