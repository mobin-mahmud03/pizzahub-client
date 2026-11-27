/**
 * PizzaHub Demo Account Seeder
 * ----------------------------
 * Creates (or recreates) the three Quick Demo Access accounts in MongoDB
 * with Better Auth-compatible credential records.
 *
 * Run from the client root:
 *   node scripts/seed-demo-users.mjs
 */

import dotenv from 'dotenv';
dotenv.config({ path: 'C:/Users/HP/.gemini/antigravity/scratch/pizzahub/client/.env.local' });

import dns from 'node:dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);
import { hashPassword } from 'better-auth/crypto';
import { MongoClient, ObjectId } from 'mongodb';

async function seedDemoAccounts() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) throw new Error('MONGODB_URI not set in .env.local');

  const client = new MongoClient(mongoUri);
  await client.connect();
  const db = client.db();

  const demoUsers = [
    {
      email: 'admin@pizzahub.com',
      name: 'System Admin',
      password: 'Admin@123456',
      role: 'admin',
      businessName: '',
    },
    {
      email: 'mario@pizzahub.com',
      name: 'Mario Rossi',
      password: 'Vendor@123456',
      role: 'vendor',
      businessName: 'Mario Authentic Pizzeria',
    },
    {
      email: 'customer@pizzahub.com',
      name: 'Pizza Lover',
      password: 'Customer@123456',
      role: 'customer',
      businessName: '',
    },
  ];

  for (const d of demoUsers) {
    const hashedPassword = await hashPassword(d.password);
    const now = new Date();

    // 1. Upsert user record
    let user = await db.collection('users').findOne({ email: d.email });
    if (!user) {
      const oid = new ObjectId();
      await db.collection('users').insertOne({
        _id: oid,
        name: d.name,
        email: d.email,
        emailVerified: true,
        image: '',
        role: d.role,
        businessName: d.businessName,
        isBlocked: false,
        subscriptionPlan: 'free',
        subscriptionExpiresAt: null,
        favorites: [],
        createdAt: now,
        updatedAt: now,
      });
      user = await db.collection('users').findOne({ _id: oid });
      console.log('  Created user:', d.email, user._id);
    } else {
      await db.collection('users').updateOne(
        { _id: user._id },
        { $set: { role: d.role, emailVerified: true, businessName: d.businessName, isBlocked: false, updatedAt: now } }
      );
      console.log('  Updated user:', d.email, user._id);
    }

    const userOid = user._id; // ObjectId
    const userIdStr = userOid.toHexString();

    // 2. Remove any stale credential accounts for this user
    await db.collection('account').deleteMany({
      providerId: 'credential',
      $or: [{ userId: userOid }, { userId: userIdStr }],
    });

    // 3. Insert fresh credential account — userId stored as ObjectId (required by Better Auth adapter)
    await db.collection('account').insertOne({
      userId: userOid,         // ← MUST be ObjectId
      accountId: userIdStr,    // Better Auth sets accountId = user.id (string hex)
      providerId: 'credential',
      password: hashedPassword,
      createdAt: now,
      updatedAt: now,
    });
    console.log('  Created credential account for:', d.email);
  }

  await client.close();
  console.log('\n✅ All demo accounts seeded successfully!');
  console.log('   admin@pizzahub.com    / Admin@123456');
  console.log('   mario@pizzahub.com    / Vendor@123456');
  console.log('   customer@pizzahub.com / Customer@123456');
}

seedDemoAccounts().catch(console.error);
