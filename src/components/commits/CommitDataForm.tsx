/** biome-ignore-all lint/correctness/noChildrenProp: This is a necessary pattern for rendering the input fields */
import { formOptions, useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { saveData } from "#/utils/commits.functions";
import { FetchCommitsInputSchema, type WeeklyReport } from "#/utils/schema";
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
	onAnalysisComplete?: (analysis: WeeklyReport) => void;
}

export function CommitDataForm({ onAnalysisComplete }: CommitDataFormProps) {
	const saveDataFn = useServerFn(saveData);

	const { mutateAsync } = useMutation({
		mutationFn: saveDataFn,
		onSuccess: ({ commits, analysis, error }) => {
			if (commits) {
				console.log("Data saved successfully:", commits);
				console.log("Analysis result:", analysis);
				if (!analysis) {
					console.warn("No analysis returned from server.");
					return;
				}

				if (onAnalysisComplete) {
					onAnalysisComplete(JSON.parse(analysis));
				}
			} else {
				console.error("Error saving data:", error);
			}
		},
		onError: (error) => {
			console.error("Mutation error:", error);
		},
	});

	const formOpts = formOptions({
		validators: {
			onChange: FetchCommitsInputSchema,
		},
		defaultValues: {
			repoPath: "",
			sinceDate: "",
			untilDate: "",
			authorEmail: "serbandavid83@yahoo.com",
		},
		onSubmit: async ({ value }) => {
			console.log("Form submitted with values:", value);
			const result = await mutateAsync({ data: value });
			console.log("Mutation completed", result);
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
							<Button type="submit">Submit</Button>
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
