import { createServerOnlyFn } from "@tanstack/react-start";
import { env } from "@/env";

export const getBetterAuthUrl = createServerOnlyFn(() => env.BETTER_AUTH_URL);
export const getBetterAuthSecret = createServerOnlyFn(
	() => env.BETTER_AUTH_SECRET,
);
export const getDatabaseUrl = createServerOnlyFn(() => env.DATABASE_URL);
export const getGoogleClientId = createServerOnlyFn(() => env.GOOGLE_CLIENT_ID);
export const getGoogleClientSecret = createServerOnlyFn(
	() => env.GOOGLE_CLIENT_SECRET,
);
