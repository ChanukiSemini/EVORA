// config/db.js
//
// Purpose: connects the backend to MongoDB Atlas using Mongoose.
// server.js just calls connectDB() — all connection details live here.

const dns = require('node:dns');
const mongoose = require('mongoose');

// Fix for a common Windows/Node issue: Node can get stuck trying
// IPv6 DNS lookups first, causing "querySrv ECONNREFUSED" errors
// when resolving MongoDB Atlas's SRV record. This forces Node to
// try IPv4 first instead.
dns.setDefaultResultOrder('ipv4first');

// Additional fix: explicitly point Node at Google's public DNS servers.
// Sometimes Node fails to properly use the DNS server Windows itself
// uses (visible as "Server: UnKnown" in nslookup), even though the
// OS can resolve the address fine. Setting servers directly bypasses
// whatever Node was defaulting to.
dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectDB = async () => {
  try {
    const mongoUri =
      process.env.MONGODB_URI ||
      process.env.MONGO_URI ||
      'mongodb://localhost:27017/evora';
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(
      `✅ MongoDB Connected to database [${conn.connection.name}] on host: ${conn.connection.host}`
    );
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
  }
};

module.exports = connectDB;
