import dns from 'node:dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);
import dotenv from 'dotenv';
dotenv.config({ path: 'C:/Users/HP/.gemini/antigravity/scratch/pizzahub/client/.env.local' });
import { auth } from '../src/lib/auth.ts';

async function testSignIn() {
  try {
    const res = await auth.api.signInEmail({
      body: {
        email: 'admin@pizzahub.com',
        password: 'Admin@123456',
      },
    });
    console.log('Result:', res);
  } catch (err) {
    console.error('Error during signInEmail:', err);
  }
}

testSignIn();
