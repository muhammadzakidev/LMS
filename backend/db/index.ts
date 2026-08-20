import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import "dotenv/config";

declare const process: {
    env: {
        DATABASE_URL?: string;
    };
};

const sql = neon(process.env.DATABASE_URL!);

export const db = drizzle({
    client: sql
});
