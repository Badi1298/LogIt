import { createFileRoute, redirect } from "@tanstack/react-router";
import { CommitDataForm } from "#/components/commits/CommitDataForm";
import { Button } from "#/components/ui/button";
import { getSession } from "#/lib/auth.functions";
import { authClient } from "#/lib/auth-client";

export const Route = createFileRoute("/")({
	beforeLoad: async () => {
		const session = await getSession();
		if (!session) {
			throw redirect({ to: "/login" });
		}
		return { user: session.user };
	},
	component: Home,
});

function Home() {
	const navigate = Route.useNavigate();
	const { user } = Route.useRouteContext();

	const handleLogout = async () => {
		await authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					navigate({ to: "/login" });
				},
			},
		});
	};

	return (
		<main className="flex flex-col h-screen w-screen p-4">
			<header className="flex justify-between items-center p-4 rounded-lg mb-10">
				<div className="flex flex-col gap-y-1">
					<h1 className="text-4xl font-bold">LogIt</h1>
					<h2 className="text-2xl font-bold mb-5">Welcome, {user.name}!</h2>
				</div>
				<Button size="lg" onClick={handleLogout}>
					Logout
				</Button>
			</header>
			<section className="flex flex-col items-center flex-1">
				<CommitDataForm />
			</section>
		</main>
	);
}
