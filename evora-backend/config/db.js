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
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/evora', {
      serverSelectionTimeoutMS: 10000,
    })
    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.warn(`MongoDB Warning: ${error.message}`)
    console.warn(`(Make sure MongoDB is running locally or set MONGO_URI in .env)`)
  }
}

module.exports = connectDB
