import { drizzle } from "drizzle-orm/postgres-js";

import * as schema from "./schema";

const databaseUrl = `${process.env.DATABASE_URL}`;

export const db = drizzle(databaseUrl, { schema });
