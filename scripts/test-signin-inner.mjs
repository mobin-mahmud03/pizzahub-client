import dns from 'node:dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);
import { auth } from '../src/lib/auth.ts';

async function testSignIn() {
  try {
    const res = await auth.api.signInEmail({
      body: {
        email: 'admin@pizzahub.com',
        password: 'Admin@123456',
      },
    });
    console.log('SignIn success! User:', res?.user?.email);
    console.log('Token/Session:', !!res?.token, !!res?.session);
  } catch (err) {
    console.error('SignIn failed:', err);
  }
  process.exit(0);
}

testSignIn().catch(console.error);
