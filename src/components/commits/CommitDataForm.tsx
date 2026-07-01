/** biome-ignore-all lint/correctness/noChildrenProp: This is a necessary pattern for rendering the input fields */

import { formOptions, useForm } from "@tanstack/react-form";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import {
	analyzeWeeklyCommits,
	fetchGitHistory,
} from "#/utils/commits.functions";
import { checkExistingAnalysis } from "#/utils/db.functions";
import {
	type FetchCommitsInput,
	FetchCommitsInputSchema,
	type WeeklyReport,
} from "#/utils/schema";
import { Button } from "../ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "../ui/field";
import { Input } from "../ui/input";

interface CommitDataFormProps {
	onAnalysisComplete?: (
		analysis: WeeklyReport,
		formData: FetchCommitsInput,
	) => void;
}

function DynamicAnalyzingText() {
	const texts = [
		"Analyzing timeline with AI...",
		"Calculating time allocations & breaks...",
		"Grouping commits by Jira tickets...",
		"Finalizing weekly report...",
	];
	const [index, setIndex] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setIndex((prev) => (prev + 1) % texts.length);
		}, 3000);
		return () => clearInterval(interval);
	}, [texts.length]);

	return <span className="animate-pulse">{texts[index]}</span>;
}

export function CommitDataForm({ onAnalysisComplete }: CommitDataFormProps) {
	const fetchGitHistoryFn = useServerFn(fetchGitHistory);
	const analyzeWeeklyCommitsFn = useServerFn(analyzeWeeklyCommits);
	const checkExistingAnalysisFn = useServerFn(checkExistingAnalysis);

	const [loadingState, setLoadingState] = useState<
		"idle" | "fetching" | "analyzing" | "checkingDB"
	>("idle");

	const formOpts = formOptions({
		validators: {
			onChange: FetchCommitsInputSchema,
		},
		defaultValues: {
			repoPath: "",
			sinceDate: new Date("2026-06-09").toISOString().split("T")[0], // Default to 7 days ago
			untilDate: new Date("2026-07-16").toISOString().split("T")[0], // Default to today
			authorEmail: "serban.david@flowmatters.com",
		},
		onSubmit: async ({ value }) => {
			try {
				setLoadingState("fetching");
				const gitResult = await fetchGitHistoryFn({ data: value });

				if (gitResult?.commits) {
					setLoadingState("analyzing");
					const aiResult = await analyzeWeeklyCommitsFn({
						data: gitResult.commits,
					});

					if (aiResult?.analysis && onAnalysisComplete) {
						onAnalysisComplete(JSON.parse(aiResult.analysis), value);
					}
				} else {
					console.error("Error fetching git history");
				}
			} catch (error) {
				console.error("Error during submission:", error);
			} finally {
				setLoadingState("idle");
			}
		},
	});

	const form = useForm(formOpts);

	return (
		<Card className="w-lg justify-self-end">
			<CardHeader className="text-center">
				<CardTitle className="text-xl">Commit Data Form</CardTitle>
				<CardDescription>
					Fill in the details to fetch commit data
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form
					id="commit-data-form"
					onSubmit={(e) => {
						e.preventDefault();
						form.handleSubmit();
					}}
				>
					<FieldGroup>
						<form.Field name="repoPath">
							{(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>Repo Path</FieldLabel>
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											aria-invalid={isInvalid}
											placeholder="e.g., /absolute/path/to/repo"
										/>
										{isInvalid && (
											<FieldError errors={field.state.meta.errors} />
										)}
									</Field>
								);
							}}
						</form.Field>
						<form.Field name="sinceDate">
							{(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>Since Date</FieldLabel>
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											aria-invalid={isInvalid}
											type="date"
										/>
										{isInvalid && (
											<FieldError errors={field.state.meta.errors} />
										)}
									</Field>
								);
							}}
						</form.Field>
						<form.Field name="untilDate">
							{(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>Until Date</FieldLabel>
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											aria-invalid={isInvalid}
											type="date"
										/>
										{isInvalid && (
											<FieldError errors={field.state.meta.errors} />
										)}
									</Field>
								);
							}}
						</form.Field>
						<form.Field name="authorEmail">
							{(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>Author Email</FieldLabel>
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											aria-invalid={isInvalid}
											type="email"
											placeholder="e.g., user@example.com"
										/>
										{isInvalid && (
											<FieldError errors={field.state.meta.errors} />
										)}
									</Field>
								);
							}}
						</form.Field>
						<Field>
							<div className="flex gap-4">
								<Button
									type="submit"
									disabled={loadingState !== "idle"}
									className="flex-1"
								>
									{loadingState === "idle" && "Submit"}
									{loadingState === "fetching" &&
										"Extracting local Git history..."}
									{loadingState === "analyzing" && <DynamicAnalyzingText />}
									{loadingState === "checkingDB" && "Checking Database..."}
								</Button>
								<Button
									type="button"
									variant="secondary"
									disabled={loadingState !== "idle"}
									onClick={async () => {
										const isValid = await form.validateAllFields("change");
										if (isValid.length > 0) return; // Validation errors exist

										try {
											setLoadingState("checkingDB");
											const result = await checkExistingAnalysisFn({
												data: form.state.values,
											});
											if (
												result.success &&
												result.analysis &&
												onAnalysisComplete
											) {
												onAnalysisComplete(
													JSON.parse(result.analysis),
													form.state.values,
												);
											} else {
												alert(
													"No saved analysis found for this query in the database.",
												);
											}
										} catch (err) {
											console.error(err);
											alert("Error checking database.");
										} finally {
											setLoadingState("idle");
										}
									}}
								>
									Check DB
								</Button>
							</div>
							<FieldDescription className="text-center">
								Your input will be validated and processed upon submission.
							</FieldDescription>
						</Field>
					</FieldGroup>
				</form>
			</CardContent>
		</Card>
	);
}
