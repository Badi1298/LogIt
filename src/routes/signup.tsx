import { createFileRoute } from "@tanstack/react-router";
import { SignupForm } from "#/components/sigup-form";

export const Route = createFileRoute("/signup")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<main className="flex h-screen w-screen items-center justify-center">
			<SignupForm />
		</main>
	);
}
