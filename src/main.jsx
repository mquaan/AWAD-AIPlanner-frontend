// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext';
import PageProvider from './context/PageContext.jsx';
import ToastProvider from './context/ToastContext.jsx';
// import './index.css'

createRoot(document.getElementById('root')).render(
  <ToastProvider>
    <PageProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </PageProvider>
  </ToastProvider>
)
