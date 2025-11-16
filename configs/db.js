import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

const sql = neon(process.env.NEXT_PUBLIC_DATABASE_CONNECTION_STRING);

export const db = drizzle(sql, { schema, logger: true });
