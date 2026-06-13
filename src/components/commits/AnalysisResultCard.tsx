import type { WeeklyReport } from "#/utils/schema";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";

type Props = {
	analysisData: WeeklyReport;
};

const AnalysisResultCard = ({ analysisData }: Props) => {
	return (
		<Card className="w-lg h-145 overflow-y-scroll">
			<CardHeader className="text-center">
				<CardTitle className="text-xl">Analysis Result</CardTitle>
				<CardDescription>
					Here you can see the results of your commit data analysis request. The
					analysis will provide insights based on the commit data you submitted.
				</CardDescription>
			</CardHeader>
			<CardContent>
				{analysisData.tasks.length > 0 ? (
					<ul>
						{analysisData.tasks.map((task) => (
							<li key={task.id}>
								<strong>{task.jiraTicket}</strong>: {task.totalHours} hours
								<ul className="list-disc list-inside ml-4">
									{task.achievements.map((achievement) => (
										<li key={task.id}>{achievement}</li>
									))}
								</ul>
							</li>
						))}
					</ul>
				) : (
					<p className="text-center">No analysis data available yet</p>
				)}
			</CardContent>
		</Card>
	);
};

export default AnalysisResultCard;
