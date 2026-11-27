import dns from 'node:dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);
import { hashPassword } from 'better-auth/crypto';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config({ path: 'C:/Users/HP/.gemini/antigravity/scratch/pizzahub/client/.env.local' });

async function seedDemoAccounts() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) throw new Error('MONGODB_URI not found');

  const client = new MongoClient(mongoUri);
  await client.connect();
  const db = client.db();

  const demoUsers = [
    {
      email: 'admin@pizzahub.com',
      name: 'System Admin',
      password: 'Admin@123456',
      role: 'admin',
    },
    {
      email: 'mario@pizzahub.com',
      name: 'Mario Rossi',
      businessName: 'Mario Authentic Pizzeria',
      password: 'Vendor@123456',
      role: 'vendor',
    },
    {
      email: 'customer@pizzahub.com',
      name: 'Pizza Lover',
      password: 'Customer@123456',
      role: 'customer',
    },
  ];

  for (const d of demoUsers) {
    let user = await db.collection('users').findOne({ email: d.email });
    const hashedPassword = await hashPassword(d.password);
    const now = new Date();

    if (!user) {
      const insertRes = await db.collection('users').insertOne({
        name: d.name,
        email: d.email,
        emailVerified: true,
        image: '',
        role: d.role,
        businessName: d.businessName || '',
        isBlocked: false,
        subscriptionPlan: 'free',
        favorites: [],
        createdAt: now,
        updatedAt: now,
      });
      user = { _id: insertRes.insertedId, id: String(insertRes.insertedId) };
      console.log('Created user:', d.email, user._id);
    } else {
      await db.collection('users').updateOne(
        { _id: user._id },
        {
          $set: {
            role: d.role,
            isBlocked: false,
            businessName: d.businessName || user.businessName || '',
            updatedAt: now,
          },
        }
      );
      console.log('Updated user:', d.email, user._id);
    }

    const userIdStr = String(user._id);

    // Upsert credential account in 'account' collection
    await db.collection('account').deleteMany({
      $or: [{ userId: user._id }, { userId: userIdStr }],
      providerId: 'credential',
    });

    await db.collection('account').insertOne({
      userId: userIdStr,
      accountId: userIdStr,
      providerId: 'credential',
      password: hashedPassword,
      createdAt: now,
      updatedAt: now,
    });
    console.log('Created credential account for:', d.email);
  }

  await client.close();
  console.log('SUCCESS: All demo accounts created with Better Auth password hashes!');
}

seedDemoAccounts().catch(console.error);
