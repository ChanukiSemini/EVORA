const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const adminRoutes = require('./routes/adminRoutes')
const authRoutes = require('./routes/authRoutes')
const { notFound, errorHandler } = require('./middleware/errorMiddleware')

// Load environment variables
dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'EVORA Backend API running' })
})

// Mount Routes
app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)

// Error Handling Middleware
app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`)
  // Connect to Database asynchronously
  connectDB()
})
