import dns from 'node:dns';

if (process.env.NODE_ENV !== 'production') {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
}

import { MongoClient, ObjectId } from "mongodb";
import { betterAuth, APIError } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt, bearer } from "better-auth/plugins";
import { hashPassword, verifyPassword } from "better-auth/crypto";

const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/pizzahub";
const client = new MongoClient(mongoUri);
client.connect().catch((e) => console.error('[Mongo]', e.message));
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
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
});
