
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from "react-router-dom"
import { AuthProvider } from '@/context/AuthContext.jsx'

// Rendering the react application to the Dom

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <AuthProvider>
    <App />

  </AuthProvider>
  </BrowserRouter>,
)
