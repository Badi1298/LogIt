import { drizzle } from "drizzle-orm/neon-http";
import { getDatabaseUrl } from "#/utils/safe-envs";
import * as schema from "./schema";

export const db = drizzle(getDatabaseUrl(), { schema });
