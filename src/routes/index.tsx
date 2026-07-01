import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import AnalysisResultCard from "#/components/commits/AnalysisResultCard";
import { CommitDataForm } from "#/components/commits/CommitDataForm";
import { Button } from "#/components/ui/button";
import { getSession } from "#/lib/auth.functions";
import { authClient } from "#/lib/auth-client";
import type { FetchCommitsInput, WeeklyReport } from "#/utils/schema";

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
	const [analysisResult, setAnalysisResult] = useState<WeeklyReport | null>(
		null,
	);
	const [lastFormData, setLastFormData] = useState<FetchCommitsInput | null>(
		null,
	);

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
			<header className="flex justify-between items-center rounded-lg mb-10">
				<div className="flex flex-col gap-y-1">
					<h1 className="text-4xl font-bold">LogIt</h1>
					<h2 className="text-2xl font-bold mb-5">Welcome, {user.name}!</h2>
				</div>
				<Button size="lg" onClick={handleLogout}>
					Logout
				</Button>
			</header>
			<section className="grid grid-cols-2 gap-20 items-center flex-1">
				<CommitDataForm
					onAnalysisComplete={(analysis, formData) => {
						setAnalysisResult(analysis);
						setLastFormData(formData);
					}}
				/>
				<AnalysisResultCard
					analysisData={analysisResult || { tasks: [] }}
					formData={lastFormData}
				/>
			</section>
		</main>
	);
}
