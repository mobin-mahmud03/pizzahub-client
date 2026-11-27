import dotenv from 'dotenv';
dotenv.config({ path: 'C:/Users/HP/.gemini/antigravity/scratch/pizzahub/client/.env.local' });
console.log('Loaded env MONGODB_URI starts with:', process.env.MONGODB_URI?.slice(0, 20));

import('./test-adapter-inner.mjs');
