import "dotenv/config"
import {defineConfig} from 'drizzle-kit';

export default defineConfig({
   dialect: "postgresql",
   schema: "./db/schema/auth-schema.ts",
   out: "./drizzle",
   dbCredentials: {
      url: (globalThis as typeof globalThis & {
         process: { env: { DATABASE_URL?: string } }
      }).process.env.DATABASE_URL!
   }
})

