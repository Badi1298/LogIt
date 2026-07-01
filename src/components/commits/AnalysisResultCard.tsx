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
		<Card className="max-h-[75vh] overflow-y-scroll">
			<CardHeader className="text-center">
				<CardTitle className="text-xl">Analysis Result</CardTitle>
				<CardDescription>
					Here you can see the results of your commit data analysis request. The
					analysis will provide insights based on the commit data you submitted.
				</CardDescription>
			</CardHeader>
			<CardContent>
				{analysisData.tasks.length > 0 ? (
					<ul className="space-y-4">
						{analysisData.tasks.map((task) => (
							<li key={task.id} className="border-b pb-4 last:border-0">
								<div className="font-bold text-lg mb-2">
									{task.jiraTicket}:{" "}
									<span className="font-normal">{task.totalHours}</span>
								</div>
								<ul className="space-y-2 ml-4">
									{task.dailyWork?.map((dayWork, dayIndex) => (
										// biome-ignore lint/suspicious/noArrayIndexKey: <Read only list of daily work that won't change, so using index as key is acceptable here>
										<li key={`${task.id}-day-${dayIndex}`}>
											<div className="font-semibold text-sm">
												- {dayWork.date}, {dayWork.hours}:
											</div>
											<ul className="list-disc list-inside ml-6 text-sm text-muted-foreground mt-1 space-y-1">
												{dayWork.achievements.map((achievement, index) => (
													<li
														// biome-ignore lint/suspicious/noArrayIndexKey: <Read only list of achievements that won't change>
														key={`${task.id}-day-${dayIndex}-ach-${index}`}
													>
														{achievement}
													</li>
												))}
											</ul>
										</li>
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
