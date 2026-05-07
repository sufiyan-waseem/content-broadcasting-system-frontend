import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { initDB } from './mocks/db.js'

// Initialize mock database with seed data on first load
initDB();

createRoot(document.getElementById('root')).render(<App />)
