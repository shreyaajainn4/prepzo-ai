import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import "./style.scss"

// Fire-and-forget: wake up the backend immediately while React initializes
// This triggers the Render cold start early so it's ready when the user logs in
if (import.meta.env.VITE_API_URL) {
  fetch(`${import.meta.env.VITE_API_URL}/api/health`).catch(() => {})
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
