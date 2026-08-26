import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { db } from "../db/index.ts";
import {
  user,
  session,
  account,
  verification,
} from "../db/schema/auth-schema.ts";
import {createAuthMiddleware, APIError} from "better-auth/api";
import {signupSchema }from "../validation/authValidation.ts";
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user,
      session,
      account,
      verification
    }
  }),

  baseURL: process.env.BETTER_AUTH_URL,

  emailAndPassword: {
    enabled: true,
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "Students",
        input: true,
      },
    },
  },
  hooks: {
  before: createAuthMiddleware(async (ctx) => {
    if (ctx.path === "/sign-up/email") {
      const result = signupSchema.safeParse(ctx.body);

      if (!result.success) {
        throw new APIError("BAD_REQUEST", {
          message:
            result.error.issues[0]?.message ??
            "Invalid signup data",
        });
      }
    }
  }),
},
});
