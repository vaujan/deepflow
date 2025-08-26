import React from "react";

export default function SessionTable() {
	const sessions = [
		{
			id: 1,
			date: "2024-01-15",
			duration: 150,
			focusLevel: 8,
			quality: 9,
			tags: "coding, project",
			goal: "Complete API integration",
			notes:
				"Had some interruptions but managed to complete the core functionality",
		},
		{
			id: 2,
			date: "2024-01-14",
			duration: 105,
			focusLevel: null,
			quality: 8,
			tags: "",
			goal: "Draft blog post outline",
			notes: "Good flow, outline is comprehensive and well-structured",
		},
		{
			id: 3,
			date: "2024-01-13",
			duration: 195,
			focusLevel: 9,
			quality: 10,
			tags: "design, ui",
			goal: "Redesign landing page",
			notes: "Excellent focus session, design came together perfectly",
		},
		{
			id: 4,
			date: "2024-01-12",
			duration: 80,
			focusLevel: 6,
			quality: 7,
			tags: "",
			goal: "Market research analysis",
			notes:
				"Found valuable insights, need to follow up on competitor analysis",
		},
		{
			id: 5,
			date: "2024-01-11",
			duration: 165,
			focusLevel: null,
			quality: 8,
			tags: "coding, debugging",
			goal: "Fix critical bugs in production",
			notes: "Resolved main issues, some edge cases still need attention",
		},
		{
			id: 6,
			date: "2024-01-10",
			duration: 90,
			focusLevel: 5,
			quality: 6,
			tags: "",
			goal: "Team sprint planning",
			notes: "Meeting was productive but could have been more focused",
		},
		{
			id: 7,
			date: "2024-01-09",
			duration: 120,
			focusLevel: 7,
			quality: 8,
			tags: "writing, documentation",
			goal: "Update technical documentation",
			notes: "Documentation is now up-to-date and well-organized",
		},
		{
			id: 8,
			date: "2024-01-08",
			duration: 75,
			focusLevel: null,
			quality: 5,
			tags: "",
			goal: "Process pending emails",
			notes: "Cleared inbox but felt like busy work",
		},
		{
			id: 9,
			date: "2024-01-07",
			duration: 180,
			focusLevel: 9,
			quality: 9,
			tags: "coding, architecture",
			goal: "Design system architecture",
			notes: "Architecture is solid, good foundation for future development",
		},
		{
			id: 10,
			date: "2024-01-06",
			duration: 105,
			focusLevel: 6,
			quality: 7,
			tags: "",
			goal: "Complete React tutorial",
			notes: "Learned new patterns, need to practice more",
		},
	];

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		const today = new Date();
		const yesterday = new Date(today);
		yesterday.setDate(yesterday.getDate() - 1);

		// Check if it's today or yesterday
		if (date.toDateString() === today.toDateString()) {
			return "Today";
		} else if (date.toDateString() === yesterday.toDateString()) {
			return "Yesterday";
		}

		// For other dates, show more detailed format
		return date.toLocaleDateString("en-US", {
			weekday: "short",
			month: "short",
			day: "numeric",
		});
	};

	const formatDuration = (minutes: number) => {
		return `${minutes}`;
	};

	const getFocusLevelColor = (level: number) => {
		if (level <= 3) return "badge-success";
		if (level <= 7) return "badge-warning";
		return "badge-error";
	};

	const getQualityColor = (quality: number) => {
		if (quality <= 5) return "badge-error";
		if (quality <= 7) return "badge-warning";
		return "badge-success";
	};

	return (
		<div className="overflow-x-auto h-full rounded-box bg-base-200">
			<table className="table h-full">
				<thead>
					<tr>
						<th className="bg-base-300/50 w-24">Deep Work (Minutes)</th>
						<th className="bg-base-300/50 w-24">Date</th>
						<th className="bg-base-300/50 w-20">Focus</th>
						<th className="bg-base-300/50 w-20">Quality</th>
						<th className="bg-base-300/50 w-32">Tags</th>
						<th className="bg-base-300/50 w-48">Goal</th>
						<th className="bg-base-300/50 w-64">Notes</th>
					</tr>
				</thead>
				<tbody className="h-full">
					{sessions.map((session, index) => (
						<tr key={session.id}>
							<td className="whitespace-nowrap">
								{formatDuration(session.duration)}
							</td>
							<td className="whitespace-nowrap">{formatDate(session.date)}</td>
							<td className="whitespace-nowrap">
								{session.focusLevel ? (
									<span
										className={`badge badge-sm rounded-sm ${getFocusLevelColor(
											session.focusLevel
										)}`}
									>
										{session.focusLevel}
									</span>
								) : (
									<span className="text-base-content/40 text-sm">—</span>
								)}
							</td>
							<td className="whitespace-nowrap">
								<span
									className={`badge badge-sm rounded-sm ${getQualityColor(
										session.quality
									)}`}
								>
									{session.quality}
								</span>
							</td>
							<td className="whitespace-nowrap">
								{session.tags ? (
									<div className="flex flex-wrap gap-1">
										{session.tags
											.split(", ")
											.filter(Boolean)
											.map((tag, tagIndex) => (
												<span key={tagIndex} className="badge badge-sm">
													#{tag}
												</span>
											))}
									</div>
								) : (
									<span className="text-base-content/40 text-sm">—</span>
								)}
							</td>
							<td className="min-w-[200px]">{session.goal}</td>
							<td className="min-w-[250px]">{session.notes}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
