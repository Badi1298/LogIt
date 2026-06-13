import { GoogleGenAI } from "@google/genai";
import { createServerFn } from "@tanstack/react-start";
import { simpleGit } from "simple-git";
import z from "zod";
import { getGoogleApiKey } from "./safe-envs";
import {
	CommitItemSchema,
	nativeResponseSchema,
	ServerFetchCommitsInputSchema,
} from "./schema";

const analyzeWeeklyCommits = createServerFn({ method: "POST" })
	.inputValidator((data: unknown) => z.array(CommitItemSchema).parse(data))
	.handler(async ({ data: commits }) => {
		// This executes purely on the server side
		const apiKey = getGoogleApiKey();
		if (!apiKey) {
			throw new Error("Missing GOOGLE_API_KEY environment variable.");
		}

		const ai = new GoogleGenAI({ apiKey });

		const systemInstruction = `
        You are an expert engineering manager evaluating a chronological git log from a single week.
        Analyze the array of commits to calculate fair time allocations using these strict heuristics:
        
        1. Delta Calculation: Estimate time spent by calculating the difference between the current commit timestamp and the *immediately preceding* commit timestamp.
        2. Initial Momentum: For the absolute first commit in the payload, assume a standard 30-minute warm-up duration.
        3. The Break Rule: If the chronological gap between any two sequential commits exceeds 1.5 hours, assume a break or context switch. Cap the billable work allocation for that specific gap at 45 minutes, dismissing the remainder of the idle time.
        `.trim();

		try {
			const response = await ai.models.generateContent({
				model: "gemini-3.5-flash",
				contents: JSON.stringify(commits),
				config: {
					systemInstruction,
					responseMimeType: "application/json",
					responseSchema: nativeResponseSchema,
				},
			});

			return {
				success: true,
				analysis: response.text,
			};
		} catch (error) {
			console.error("Google GenAI API Error:", error);
			throw new Error("Failed to parse weekly commits via Google GenAI.");
		}
	});

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

			const result = await analyzeWeeklyCommits({ data: processedCommits });

			return {
				success: true,
				commits: processedCommits,
				analysis: result.analysis,
			};
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : String(error);
			return { success: false, error: errorMessage };
		}
	});
