"use client";

import React, { useMemo } from "react";
import { mockSessions } from "../../data/mockSessions";
// Using theme colors via CSS variables; no per-tag color mapping needed

interface TagData {
	name: string;
	value: number;
	percentage: number;
	sessions: number;
}

type BarChartData = TagData;

const calculateTagStats = (): TagData[] => {
	// Aggregate focus time by tags
	const tagTimeMap = new Map<string, { totalTime: number; sessions: number }>();

	mockSessions.forEach((session) => {
		session.tags.forEach((tag) => {
			const current = tagTimeMap.get(tag) || { totalTime: 0, sessions: 0 };
			tagTimeMap.set(tag, {
				totalTime: current.totalTime + session.elapsedTime,
				sessions: current.sessions + 1,
			});
		});
	});

	// Calculate total time for percentage calculation
	const totalTime = Array.from(tagTimeMap.values()).reduce(
		(acc, data) => acc + data.totalTime,
		0
	);

	// Convert to array and calculate percentages
	const tagData = Array.from(tagTimeMap.entries()).map(([tag, data]) => ({
		name: tag,
		value: data.totalTime,
		percentage: totalTime > 0 ? (data.totalTime / totalTime) * 100 : 0,
		sessions: data.sessions,
	}));

	// Sort by total time (descending)
	return tagData.sort((a, b) => b.value - a.value);
};

// Single color (hsl(var(--p))) used for all bars; no palette required

const formatTime = (seconds: number): string => {
	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	return `${hours}h ${minutes}m`;
};

export default function TagsOverview() {
	const tagStats = useMemo(() => calculateTagStats(), []);

	// Prepare data for bar chart (single color applied via bar fill)
	const barData: BarChartData[] = tagStats;

	return (
		<div className="w-full flex-1 lg:min-w-md h-full">
			<div className="flex h-full w-full gap-4">
				{/* Tags Overview Card */}

				<div className="w-full flex flex-col justify-between	">
					{/* Info header */}
					<div className="grid grid-cols-2 gap-4">
						{/* Most Used Tag */}
						<div className="flex flex-col border-r border-border p-4 gap-1">
							<p className="text-sm text-medium text-base-content/60">
								Most Used Tag
							</p>
							<p className="text-2xl font-medium text-base-content font-mono">
								{barData.length > 0 ? barData[0].name : "N/A"}
							</p>
							<p className="text-xs text-base-content/50">
								{barData.length > 0
									? `${barData[0].sessions} sessions`
									: "No data"}
							</p>
						</div>

						{/* Tag Diversity */}
						<div className="flex p-4 flex-col gap-1">
							<p className="text-sm text-medium text-base-content/60">
								Tag Diversity
							</p>
							<p className="text-2xl font-medium text-base-content font-mono">
								{barData.length}
							</p>
							<p className="text-xs text-base-content/50">Unique tags</p>
						</div>
					</div>

					{/* Tag Usage Insights */}
					{barData.length > 0 && (
						<div className="pt-4 mt-3 bg-card rounded-box">
							<div className="w-full relative rounded-box flex p-2 gap-3 overflow-x-auto h-[200px] min-h-48 overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-base-300 scrollbar-track-transparent">
								<div className="w-full space-y-2">
									{barData.map((tag, index) => (
										<div
											key={tag.name}
											className="flex transition-all ease-out items-center p-2 justify-between border-b-1 border-border dark:border-gray-6"
										>
											<div className="flex items-center gap-2">
												{/* <div className="w-3 h-3 rounded-full flex-shrink-0 bg-base-300" /> */}
												<span className="text-sm font-mono font-medium text-base-content">
													{tag.name}
												</span>
												{index === 0 && (
													<span className="badge badge-xs badge-soft badge-accent rounded-sm">
														Most Used
													</span>
												)}
											</div>
											<div className="flex items-center gap-2 text-xs text-base-content/60 flex-shrink-0">
												<span className="font-mono">
													{(tag.value / 3600).toFixed(1)}h
												</span>
												<span className="font-mono">
													({tag.percentage.toFixed(1)}%)
												</span>
											</div>
										</div>
									))}
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
