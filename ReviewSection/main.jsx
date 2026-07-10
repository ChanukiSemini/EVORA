import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ReviewForm from './ReviewForm.jsx'

createRoot(document.getElementById('review-form-root')).render(
    <StrictMode>
        <ReviewForm />
    </StrictMode>,
)
