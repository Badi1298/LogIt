import path from "node:path";
import { z } from "zod";

export const FetchCommitsInputSchema = z.object({
	repoPath: z.string().min(1),
	sinceDate: z.iso.date("sinceDate must be in YYYY-MM-DD format"),
	untilDate: z.iso.date("untilDate must be in YYYY-MM-DD format"),
	authorEmail: z.email("Invalid email address format"),
});

// Supercharge the base schema with server-only Node.js validation
export const ServerFetchCommitsInputSchema = FetchCommitsInputSchema.refine(
	(data) => path.isAbsolute(data.repoPath),
	{
		message: "repoPath must be an absolute path",
		path: ["repoPath"], // Attaches the error to the correct field
	},
);

export const CommitItemSchema = z.object({
	date: z.string(),
	message: z.string(),
	jiraTicket: z.string(),
});

// Automatically extract the TypeScript type so you don't have to maintain both
export type FetchCommitsInput = z.infer<typeof FetchCommitsInputSchema>;
export type ServerFetchCommitsInput = z.infer<
	typeof ServerFetchCommitsInputSchema
>;
