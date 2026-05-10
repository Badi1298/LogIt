import { createFileRoute, redirect } from "@tanstack/react-router";
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
		<main className="flex flex-col gap-y-10 h-screen w-screen items-center justify-center">
			<h1 className="text-2xl font-bold">Welcome, {user.name}!</h1>
			<Button size="lg" onClick={handleLogout}>
				Logout
			</Button>
		</main>
	);
}
