import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { AccountTypeProvider } from './context/AccountTypeContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AccountTypeProvider>
        <App />
      </AccountTypeProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
