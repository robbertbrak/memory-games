import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import MultiplicationGame from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MultiplicationGame />
  </StrictMode>,
)
