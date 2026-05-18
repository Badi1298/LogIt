import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import {
	getBetterAuthUrl,
	getGoogleClientId,
	getGoogleClientSecret,
} from "#/utils/safe-envs";
import { db } from "../db/drizzle";
import * as schema from "../db/schema";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
		schema,
	}),
	baseURL: getBetterAuthUrl(),
	emailAndPassword: {
		enabled: true,
	},
	socialProviders: {
		google: {
			clientId: getGoogleClientId(),
			clientSecret: getGoogleClientSecret(),
		},
		// github: {
		// 	clientId: process.env.GITHUB_CLIENT_ID as string,
		// 	clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
		// },
	},
	plugins: [tanstackStartCookies()],
});
