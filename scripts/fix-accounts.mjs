import dns from 'node:dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);
import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config({ path: 'C:/Users/HP/.gemini/antigravity/scratch/pizzahub/client/.env.local' });

async function fixAccountUserIds() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db();
  const accounts = await db.collection('account').find({}).toArray();
  for (const a of accounts) {
    if (typeof a.userId === 'string' && ObjectId.isValid(a.userId)) {
      await db.collection('account').updateOne(
        { _id: a._id },
        { $set: { userId: new ObjectId(a.userId) } }
      );
      console.log('Converted userId to ObjectId for account:', a._id, a.accountId);
    }
  }
  await client.close();
  console.log('All account userIds updated to ObjectId!');
}

fixAccountUserIds().catch(console.error);
