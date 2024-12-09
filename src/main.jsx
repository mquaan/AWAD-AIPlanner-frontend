// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext';
import PageProvider from './context/PageContext.jsx';
// import './index.css'

createRoot(document.getElementById('root')).render(
  <PageProvider>
    <AuthProvider>
      <App />
    </AuthProvider>
  </PageProvider>
)
