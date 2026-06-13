import path from "node:path";
import { createServerFn } from "@tanstack/react-start";
import { simpleGit } from "simple-git";
import { z } from "zod";

export const FetchCommitsInputSchema = z.object({
	repoPath: z
		.string()
		.min(1)
		.refine((val) => path.isAbsolute(val), {
			message: "repoPath must be an absolute path",
		}),

	// .date() natively enforces "YYYY-MM-DD" in Zod 3.23+
	sinceDate: z.iso.date("sinceDate must be in YYYY-MM-DD format"),
	untilDate: z.iso.date("untilDate must be in YYYY-MM-DD format"),
	authorEmail: z.email("Invalid email address format"),
});

// Automatically extract the TypeScript type so you don't have to maintain both
export type FetchCommitsInput = z.infer<typeof FetchCommitsInputSchema>;

// POST request
export const saveData = createServerFn({ method: "POST" })
	.inputValidator(FetchCommitsInputSchema)
	.handler(async ({ data }) => {
		try {
			// Initialize simple-git targeting your local directory path
			const git = simpleGit(data.repoPath);

			// Ensure it's a valid git repository before reading
			const isRepo = await git.checkIsRepo();
			if (!isRepo) {
				throw new Error("Provided path is not a valid git repository.");
			}

			// Query local git log with specific flags
			const logOptions = {
				"--since": data.sinceDate,
				"--until": data.untilDate,
				"--author": data.authorEmail,
				"--all": null, // Inspects all branches, not just the currently checked-out one
			};

			const logSummary = await git.log(logOptions);

			// Post-process commits: Group messages by Jira ticket
			const processedCommits = logSummary.all.map((commit) => {
				// Regex to match Jira key format: e.g., PROJ-123
				const jiraMatch = commit.message.match(/^([A-Z]+-\d+)/);
				const jiraTicket = jiraMatch ? jiraMatch[1] : "NO-TICKET";

				return {
					hash: commit.hash,
					date: commit.date, // Timestamp
					message: commit.message,
					jiraTicket,
				};
			});

			return { success: true, commits: processedCommits };
		} catch (error: any) {
			return { success: false, error: error.message };
		}
	});
