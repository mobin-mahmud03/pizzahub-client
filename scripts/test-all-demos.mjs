import dns from 'node:dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);
import { auth } from '../src/lib/auth.ts';

const demos = [
  { email: 'admin@pizzahub.com', password: 'Admin@123456', role: 'Admin' },
  { email: 'mario@pizzahub.com', password: 'Vendor@123456', role: 'Vendor' },
  { email: 'customer@pizzahub.com', password: 'Customer@123456', role: 'Customer' },
];

async function testAll() {
  for (const d of demos) {
    try {
      const res = await auth.api.signInEmail({
        body: { email: d.email, password: d.password },
      });
      console.log(`✅ ${d.role}: ${d.email} -> signed in as role: ${res?.user?.role}`);
    } catch (err) {
      console.error(`❌ ${d.role}: ${d.email} -> FAILED: ${err.body?.message || err.message}`);
    }
  }
  process.exit(0);
}

testAll().catch(console.error);
