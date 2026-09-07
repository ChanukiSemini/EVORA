// verify.js – quick sanity check for API routes (uses built-in http, no extra deps)
const http = require('http');

const base = 'http://localhost:5000/api/stations';

function get(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error('JSON parse failed')); }
      });
    }).on('error', reject);
  });
}

async function check() {
  try {
    const listJson = await get(`${base}?page=1&limit=10`);
    console.log('✅ /api/stations ->', listJson?.data?.length ?? 0, 'items');

    const firstId = listJson?.data?.[0]?.slug;
    if (!firstId) throw new Error('no stations returned');
    const detailJson = await get(`${base}/${firstId}`);
    console.log('✅ /api/stations/:id ->', detailJson?.data?.name);
    process.exit(0);
  } catch (e) {
    console.error('❌ verification failed:', e.message);
    process.exit(1);
  }
}

check();
