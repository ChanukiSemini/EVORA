import mongoose from 'mongoose';
import 'dotenv/config';

await mongoose.connect(process.env.MONGODB_URI);

// List all collections
const collections = await mongoose.connection.db.listCollections().toArray();
console.log('=== Collections in EVORA-db ===');
collections.forEach(c => console.log(' -', c.name));

// Check ev_driver collection
const evDriverDocs = await mongoose.connection.db.collection('ev_driver').find({}).toArray();
console.log('\n=== ev_driver documents ===');
console.log(JSON.stringify(evDriverDocs, null, 2));

// Also check if there's a wrongly-named collection (evdrivers, ev-drivers, etc.)
for (const wrongName of ['evdrivers', 'ev-drivers', 'ev_drivers']) {
    const wrongDocs = await mongoose.connection.db.collection(wrongName).find({}).toArray();
    if (wrongDocs.length > 0) {
        console.log(`\n=== Found docs in wrong collection "${wrongName}" ===`);
        console.log(JSON.stringify(wrongDocs, null, 2));
    }
}

await mongoose.disconnect();
console.log('\nDone.');
