import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";
import z from "zod";
import { db } from "../db/drizzle";
import { analysisResponses } from "../db/schema";
import { getSession } from "../lib/auth.functions";
import { FetchCommitsInputSchema } from "./schema";

const SaveAnalysisInputSchema = z.object({
	formData: FetchCommitsInputSchema,
	analysis: z.string(),
});

export const checkExistingAnalysis = createServerFn({ method: "POST" })
	.validator(FetchCommitsInputSchema)
	.handler(async ({ data }) => {
		const session = await getSession();
		if (!session) {
			throw new Error("Unauthorized");
		}

		const existing = await db.query.analysisResponses.findFirst({
			where: and(
				eq(analysisResponses.userId, session.user.id),
				eq(analysisResponses.repoPath, data.repoPath),
				eq(analysisResponses.sinceDate, data.sinceDate),
				eq(analysisResponses.untilDate, data.untilDate),
				eq(analysisResponses.authorEmail, data.authorEmail),
			),
		});

		if (existing) {
			return { success: true, analysis: existing.analysis };
		}

		return { success: false, analysis: null };
	});

export const saveAnalysisResponse = createServerFn({ method: "POST" })
	.validator(SaveAnalysisInputSchema)
	.handler(async ({ data }) => {
		const session = await getSession();
		if (!session) {
			throw new Error("Unauthorized");
		}

		// Optionally check if one already exists to avoid duplicates
		await db.delete(analysisResponses).where(
			and(
				eq(analysisResponses.userId, session.user.id),
				eq(analysisResponses.repoPath, data.formData.repoPath),
				eq(analysisResponses.sinceDate, data.formData.sinceDate),
				eq(analysisResponses.untilDate, data.formData.untilDate),
				eq(analysisResponses.authorEmail, data.formData.authorEmail),
			),
		);

		await db.insert(analysisResponses).values({
			userId: session.user.id,
			repoPath: data.formData.repoPath,
			sinceDate: data.formData.sinceDate,
			untilDate: data.formData.untilDate,
			authorEmail: data.formData.authorEmail,
			analysis: data.analysis,
		});

		return { success: true };
	});
