import path from "node:path";
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
