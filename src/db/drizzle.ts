import { drizzle } from "drizzle-orm/neon-http";
import { getDatabaseUrl } from "#/utils/safe-envs";

export const db = drizzle(getDatabaseUrl());
