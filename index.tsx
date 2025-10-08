import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import { CourseProvider } from './context/CourseContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

// IMPORTANT: Replace this with your actual Google OAuth Client ID
// To get one:
// 1. Go to https://console.cloud.google.com/
// 2. Create a new project or select existing
// 3. Enable Google+ API
// 4. Go to Credentials > Create Credentials > OAuth Client ID
// 5. Choose "Web application"
// 6. Add authorized JavaScript origins (e.g., http://localhost:5173)
// 7. Copy the Client ID and paste it here

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '1234567890-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com';

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