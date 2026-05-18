import { useForm } from "@tanstack/react-form";
import { Link } from "@tanstack/react-router";
import * as z from "zod";
import { Button } from "#/components/ui/button.tsx";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/components/ui/card.tsx";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldSeparator,
} from "#/components/ui/field.tsx";
import { Input } from "#/components/ui/input.tsx";
import { authClient } from "#/lib/auth-client";
import { cn } from "#/lib/utils.ts";

const formSchema = z
	.object({
		name: z.string().min(2, "Name must be at least 2 characters long."),
		email: z.email("Please enter a valid email address."),
		password: z.string().min(8, "Password must be at least 8 characters long."),
		confirmPassword: z.string(),
	})
	.refine((values) => values.password === values.confirmPassword, {
		message: "Passwords do not match.",
		path: ["confirmPassword"],
	});

export function SignupForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const signUpWithGoogle = async () => {
		await authClient.signIn.social({
			provider: "google",
			callbackURL: "/",
		});
	};

	// const signUpWithGitHub = async () => {
	// 	await authClient.signIn.social({
	// 		provider: "github",
	// 		callbackURL: "/",
	// 	});
	// };

	const form = useForm({
		defaultValues: {
			name: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
		validators: {
			onSubmit: formSchema,
		},
		onSubmit: async (values) => {
			await authClient.signUp.email(
				{
					name: values.formApi.getFieldValue("name"),
					email: values.formApi.getFieldValue("email"),
					password: values.formApi.getFieldValue("password"),
					callbackURL: "/",
				},
				{
					onSuccess: () => {
						console.log("Signup successful, redirecting to home...");
					},
					onError: (error) => {
						console.error("Signup failed:", error);
					},
				},
			);
		},
	});

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card className="min-w-md">
				<CardHeader className="text-center">
					<CardTitle className="text-xl">Create your account</CardTitle>
					<CardDescription>Sign up with your Google account</CardDescription>
				</CardHeader>
				<CardContent>
					<form
						id="signup-form"
						onSubmit={(e) => {
							e.preventDefault();
							form.handleSubmit();
						}}
					>
						<FieldGroup>
							<Field>
								<Button
									variant="outline"
									type="button"
									onClick={signUpWithGoogle}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										aria-hidden="true"
									>
										<path
											d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
											fill="currentColor"
										/>
									</svg>
									Sign up with Google
								</Button>
								{/* <Button
									variant="outline"
									type="button"
									onClick={signUpWithGitHub}
								>
									Sign up with GitHub
								</Button> */}
							</Field>
							<FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
								Or continue with
							</FieldSeparator>

							<form.Field name="name">
								{(field) => {
									const isInvalid =
										field.state.meta.isTouched && !field.state.meta.isValid;
									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel htmlFor={field.name}>Name</FieldLabel>
											<Input
												id={field.name}
												name={field.name}
												type="text"
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												aria-invalid={isInvalid}
												placeholder="Jane Doe"
												autoComplete="name"
											/>
											{isInvalid && (
												<FieldError errors={field.state.meta.errors} />
											)}
										</Field>
									);
								}}
							</form.Field>
							<form.Field name="email">
								{(field) => {
									const isInvalid =
										field.state.meta.isTouched && !field.state.meta.isValid;
									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel htmlFor={field.name}>Email</FieldLabel>
											<Input
												id={field.name}
												name={field.name}
												type="email"
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												aria-invalid={isInvalid}
												placeholder="m@example.com"
												autoComplete="email"
											/>
											{isInvalid && (
												<FieldError errors={field.state.meta.errors} />
											)}
										</Field>
									);
								}}
							</form.Field>
							<form.Field name="password">
								{(field) => {
									const isInvalid =
										field.state.meta.isTouched && !field.state.meta.isValid;
									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel htmlFor={field.name}>Password</FieldLabel>
											<Input
												id={field.name}
												name={field.name}
												type="password"
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												aria-invalid={isInvalid}
												placeholder="••••••••"
												autoComplete="new-password"
											/>
											{isInvalid && (
												<FieldError errors={field.state.meta.errors} />
											)}
										</Field>
									);
								}}
							</form.Field>
							<form.Field name="confirmPassword">
								{(field) => {
									const isInvalid =
										field.state.meta.isTouched && !field.state.meta.isValid;
									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel htmlFor={field.name}>
												Confirm password
											</FieldLabel>
											<Input
												id={field.name}
												name={field.name}
												type="password"
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												aria-invalid={isInvalid}
												placeholder="••••••••"
												autoComplete="new-password"
											/>
											{isInvalid && (
												<FieldError errors={field.state.meta.errors} />
											)}
										</Field>
									);
								}}
							</form.Field>
							<Field>
								<Button type="submit">Create account</Button>
								<FieldDescription className="text-center">
									Already have an account? <Link to="/login">Log in</Link>
								</FieldDescription>
							</Field>
						</FieldGroup>
					</form>
				</CardContent>
			</Card>
			<FieldDescription className="px-6 text-center">
				By clicking continue, you agree to our
			</FieldDescription>
		</div>
	);
}
