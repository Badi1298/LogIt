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

export const WeeklyReportSchema = z.object({
	tasks: z.array(
		z.object({
			id: z
				.string()
				.describe(
					"Unique identifier for FE rendering (e.g., UUID or JiraTicket-Index)",
				),
			jiraTicket: z
				.string()
				.describe(
					"The Jira ticket key, or 'NO-TICKET' for miscellaneous work.",
				),
			totalHours: z
				.string()
				.describe(
					"The calculated total time spent on this ticket for the week in Jira's native format (e.g., '6h 30m').",
				),
			dailyWork: z
				.array(
					z.object({
						date: z.string().describe("The date formatted as Day Date (e.g., 'Mon 26th')."),
						hours: z.string().describe("Time spent on this specific day in Jira's native format (e.g., '3h 15m')."),
						achievements: z
							.array(z.string())
							.describe(
								"A list of clean, descriptive bullet summaries showing what was built or fixed on this specific day.",
							),
					})
				)
				.describe("A daily breakdown of work done on this ticket."),
		}),
	),
});

export const nativeResponseSchema = {
	type: "OBJECT",
	properties: {
		tasks: {
			type: "ARRAY",
			items: {
				type: "OBJECT",
				properties: {
					id: {
						type: "STRING",
						description:
							"Unique identifier for FE listning and rendering purposes (e.g., UUID or JiraTicket-Index)",
					},
					jiraTicket: {
						type: "STRING",
						description: "The Jira ticket key or 'NO-TICKET'",
					},
					totalHours: {
						type: "STRING",
						description:
							"Total time spent on this ticket in Jira's native string format, e.g., '6h 30m'. Do not include 0m or 0h elements.",
					},
					dailyWork: {
						type: "ARRAY",
						description: "A daily breakdown of work done on this ticket.",
						items: {
							type: "OBJECT",
							properties: {
								date: {
									type: "STRING",
									description: "The date formatted as Day Date (e.g., 'Mon 26th')."
								},
								hours: {
									type: "STRING",
									description: "Time spent on this specific day in Jira's native format (e.g., '3h 15m')."
								},
								achievements: {
									type: "ARRAY",
									items: { type: "STRING" },
									description:
										"List of concise summaries detailing specific milestones achieved on this day",
								},
							},
							required: ["date", "hours", "achievements"],
						},
					},
				},
				required: ["id", "jiraTicket", "totalHours", "dailyWork"],
			},
		},
	},
	required: ["tasks"],
};

// Automatically extract the TypeScript type so you don't have to maintain both
export type FetchCommitsInput = z.infer<typeof FetchCommitsInputSchema>;
export type ServerFetchCommitsInput = z.infer<
	typeof ServerFetchCommitsInputSchema
>;
export type WeeklyReport = z.infer<typeof WeeklyReportSchema>;
