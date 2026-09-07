// config/db.js
//
// Purpose: connects the backend to MongoDB Atlas using Mongoose.
// server.js just calls connectDB() — all connection details live here.

import dns from 'node:dns';
import mongoose from 'mongoose';

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

async function connectDB() {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB connection error: ${error.message}`);
        process.exit(1);
    }
}

export default connectDB;