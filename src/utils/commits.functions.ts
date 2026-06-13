import { createServerFn } from "@tanstack/react-start";
import { simpleGit } from "simple-git";
import { ServerFetchCommitsInputSchema } from "./schema";

// POST request
export const saveData = createServerFn({ method: "POST" })
	.inputValidator(ServerFetchCommitsInputSchema)
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
					date: commit.date, // Timestamp
					message: commit.message,
					jiraTicket,
				};
			});

			processedCommits.sort(
				(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
			);

			return { success: true, commits: processedCommits };
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : String(error);
			return { success: false, error: errorMessage };
		}
	});
