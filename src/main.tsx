import React from 'react'
import ReactDOM from 'react-dom/client'
import '@picocss/pico/css/pico.min.css'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
