import dns from 'node:dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);
import { auth } from '../src/lib/auth.ts';

async function testAdapter() {
  const ctx = await auth.$context;
  const user = await ctx.adapter.findOne({
    model: 'user',
    where: [{ field: 'email', value: 'admin@pizzahub.com' }]
  });
  console.log('Adapter findOne user:', user);
  const allUsers = await ctx.adapter.findMany({
    model: 'user',
  });
  console.log('Adapter all users count:', allUsers.length, allUsers.map(u => ({ id: u.id, email: u.email })));
}

testAdapter().catch(console.error);
