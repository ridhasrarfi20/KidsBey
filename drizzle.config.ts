import "dotenv/config";
import type { Config } from "drizzle-kit";

const config: Config = {
  schema: "./db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql", // Ensure this matches your PostgreSQL setup
  dbCredentials: {
    url: process.env.DATABASE_URL, // Use url if you have the full connection string in DATABASE_URL
  },
};

export default config;
