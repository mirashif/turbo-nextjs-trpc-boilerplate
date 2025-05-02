import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { bigint } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: bigint("id", { mode: "bigint" }).primaryKey(),
  createdAt: timestamp("created_at").defaultNow(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
});
