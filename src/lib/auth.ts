import dns from 'node:dns';

// Apply Google DNS on all environments — Vercel's DNS can fail to resolve
// MongoDB Atlas SRV records without this.
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (_) { /* ignore in environments that don't support it */ }

import { MongoClient, ObjectId } from "mongodb";
import { betterAuth, APIError } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt, bearer } from "better-auth/plugins";
import { hashPassword, verifyPassword } from "better-auth/crypto";

const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  console.error('[Better Auth] MONGODB_URI environment variable is missing!');
}

// Use a module-level promise so every serverless invocation waits for the
// same connection rather than racing to open multiple.
const client = new MongoClient(mongoUri || "mongodb://127.0.0.1:27017/pizzahub", {
  serverSelectionTimeoutMS: 15000,
  connectTimeoutMS: 15000,
});
const connectionPromise = client.connect().catch((e) =>
  console.error('[Mongo] initial connect error:', e.message)
);
const db = client.db();

export const auth = betterAuth({
  database: mongodbAdapter(db),
  user: {
    modelName: "users",
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "customer",
      },
      businessName: {
        type: "string",
        required: false,
      },
      isBlocked: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: false,
      },
      subscriptionPlan: {
        type: "string",
        required: false,
        defaultValue: "free",
        input: false,
      },
      subscriptionExpiresAt: {
        type: "date",
        required: false,
        input: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    password: {
      hash: async (password: string) => {
        if (!/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
          throw new APIError("BAD_REQUEST", {
            message: "Password must contain at least one uppercase and one lowercase letter.",
          });
        }
        return hashPassword(password);
      },
      verify: async ({ hash, password }: { hash: string; password: string }) => {
        return verifyPassword({ hash, password });
      },
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          // SECURITY: in databaseHooks.user.create.before, force role to 'customer'
          // unless the requested role is exactly 'vendor' or 'customer'.
          // Never allow 'admin' from public sign-up.
          const requestedRole = (user as any).role;
          const role =
            requestedRole === "vendor" || requestedRole === "customer"
              ? requestedRole
              : "customer";

          return {
            data: {
              ...user,
              role,
            },
          };
        },
      },
    },
    session: {
      create: {
        before: async (session) => {
          // SECURITY: in databaseHooks.session.create.before, load the user
          // and throw if isBlocked is true so blocked users cannot sign in.
          const userId = session.userId;
          let userDoc: any = null;
          if (ObjectId.isValid(userId)) {
            userDoc = await db.collection("users").findOne({
              $or: [{ _id: new ObjectId(userId) }, { _id: userId as any }, { id: userId }],
            });
          } else {
            userDoc = await db.collection("users").findOne({
              $or: [{ _id: userId as any }, { id: userId }],
            });
          }

          if (userDoc?.isBlocked) {
            throw new APIError("FORBIDDEN", {
              message: "Your account has been blocked. You cannot sign in.",
            });
          }
        },
      },
    },
  },
  plugins: [
    jwt({
      jwt: {
        definePayload: ({ user }) => {
          return {
            id: user.id,
            role: (user as any).role || "customer",
          };
        },
      },
    }),
    bearer(),
  ],
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    ...(process.env.BETTER_AUTH_URL ? [process.env.BETTER_AUTH_URL] : []),
    ...(process.env.NEXT_PUBLIC_BETTER_AUTH_URL ? [process.env.NEXT_PUBLIC_BETTER_AUTH_URL] : []),
    ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
    ...(process.env.VERCEL_PROJECT_PRODUCTION_URL ? [`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`] : []),
  ],
});
