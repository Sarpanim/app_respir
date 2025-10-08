import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import { CourseProvider } from './context/CourseContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Google OAuth Client ID from environment variables
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

if (!GOOGLE_CLIENT_ID) {
  console.error('VITE_GOOGLE_CLIENT_ID is not defined in environment variables');
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <ThemeProvider>
        <AppProvider>
          <CourseProvider>
            <App />
          </CourseProvider>
        </AppProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);