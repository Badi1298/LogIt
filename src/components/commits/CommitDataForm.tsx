/** biome-ignore-all lint/correctness/noChildrenProp: This is a necessary pattern for rendering the input fields */
import { formOptions, useForm } from "@tanstack/react-form";
import { FetchCommitsInputSchema } from "#/utils/schema";

export function CommitDataForm() {
	const formOpts = formOptions({
		validators: {
			onChange: FetchCommitsInputSchema,
		},
		defaultValues: {
			repoPath: "",
			sinceDate: "",
			untilDate: "",
			authorEmail: "serban.david@flowmatters.com",
		},
		onSubmit: async ({ value }) => {
			console.log("Form submitted with values:", value);
		},
	});

	const form = useForm(formOpts);

	return (
		<>
			<form.Field
				name="repoPath"
				children={(field) => (
					<>
						<input
							value={field.state.value}
							onBlur={field.handleBlur}
							onChange={(e) => field.handleChange(e.target.value)}
							className="w-full p-2 border rounded-md"
						/>
					</>
				)}
			/>
			<form.Field
				name="sinceDate"
				children={(field) => (
					<>
						<input
							value={field.state.value}
							onBlur={field.handleBlur}
							type="date"
							onChange={(e) => field.handleChange(e.target.value)}
							className="w-full p-2 border rounded-md"
						/>
					</>
				)}
			/>
			<form.Field
				name="untilDate"
				children={(field) => (
					<>
						<input
							value={field.state.value}
							onBlur={field.handleBlur}
							type="date"
							onChange={(e) => field.handleChange(e.target.value)}
							className="w-full p-2 border rounded-md"
						/>
					</>
				)}
			/>
			<form.Field
				name="authorEmail"
				children={(field) => (
					<>
						<input
							value={field.state.value}
							onBlur={field.handleBlur}
							type="email"
							onChange={(e) => field.handleChange(e.target.value)}
							className="w-full p-2 border rounded-md"
						/>
					</>
				)}
			/>
		</>
	);
}
