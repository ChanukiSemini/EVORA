const mongoose = require('mongoose')
const dns = require('dns')

// Set public DNS servers to resolve MongoDB Atlas SRV records on Windows
try {
  dns.setServers(['8.8.8.8', '1.1.1.1'])
} catch (err) {
  console.warn('Could not set custom DNS servers:', err.message)
}

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/evora'
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    })
    console.log(`✅ MongoDB Connected to database [${conn.connection.name}] on host: ${conn.connection.host}`)
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`)
  }
}

module.exports = connectDB
