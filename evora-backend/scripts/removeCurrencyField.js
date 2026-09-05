// backend/scripts/removeCurrencyField.js
//
// One-off cleanup: removes the leftover "currency" field from
// documents where it exists but was never part of the schema.
// Run manually once, then this script can be deleted.

import 'dotenv/config';
import dns from 'node:dns';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';

dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);

async function removeCurrencyField() {
    await connectDB();

    const collections = ['reviews'];

    for (const name of collections) {
        const result = await mongoose.connection.db
            .collection(name)
            .updateMany({}, { $unset: { currency: '' } });
        console.log(`${name}: removed currency field from ${result.modifiedCount} documents`);
    }

    mongoose.connection.close();
}

removeCurrencyField();
