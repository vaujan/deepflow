"use client";

import React from "react";
import { mockSessions } from "../../data/mockSessions";

// Simple chart component using CSS and HTML (no external chart library)
const ProductivityChart: React.FC = () => {
	// Group sessions by day for the last 7 days
	const getLast7Days = () => {
		const days = [];
		const today = new Date();

		for (let i = 6; i >= 0; i--) {
			const date = new Date(today);
			date.setDate(date.getDate() - i);
			days.push(date);
		}

		return days;
	};

	const days = getLast7Days();

	// Calculate daily stats
	const dailyStats = days.map((day) => {
		const dayStart = new Date(day);
		dayStart.setHours(0, 0, 0, 0);
		const dayEnd = new Date(day);
		dayEnd.setHours(23, 59, 59, 999);

		const daySessions = mockSessions.filter(
			(session) => session.startTime >= dayStart && session.startTime <= dayEnd
		);

		const totalTime = daySessions.reduce(
			(acc, session) => acc + session.elapsedTime,
			0
		);
		const avgQuality =
			daySessions.length > 0
				? daySessions.reduce(
						(acc, session) => acc + (session.deepWorkQuality || 0),
						0
				  ) / daySessions.length
				: 0;

		return {
			date: day,
			sessions: daySessions.length,
			totalTime: totalTime / 3600, // Convert to hours
			avgQuality,
		};
	});

	const maxTime = Math.max(...dailyStats.map((d) => d.totalTime), 1);
	const maxSessions = Math.max(...dailyStats.map((d) => d.sessions), 1);

	return (
		<div className="space-y-4">
			{/* Chart */}
			<div className="h-48 flex items-end justify-between gap-2 p-4 bg-base-200 rounded-lg">
				{dailyStats.map((day, index) => {
					const timeHeight = (day.totalTime / maxTime) * 100;
					const sessionHeight = (day.sessions / maxSessions) * 100;

					return (
						<div
							key={index}
							className="flex flex-col items-center gap-2 flex-1"
						>
							{/* Bars */}
							<div className="flex items-end gap-1 h-32 w-full justify-center">
								{/* Time bar */}
								<div className="flex flex-col items-center gap-1">
									<div
										className="w-3 bg-primary rounded-t transition-all duration-500"
										style={{ height: `${timeHeight}%` }}
									/>
									<div className="text-xs text-base-content/60">Time</div>
								</div>

								{/* Sessions bar */}
								<div className="flex flex-col items-center gap-1">
									<div
										className="w-3 bg-secondary rounded-t transition-all duration-500"
										style={{ height: `${sessionHeight}%` }}
									/>
									<div className="text-xs text-base-content/60">Sessions</div>
								</div>
							</div>

							{/* Day label */}
							<div className="text-xs text-base-content/60 text-center">
								{day.date.toLocaleDateString("en-US", { weekday: "short" })}
								<br />
								{day.date.getDate()}
							</div>
						</div>
					);
				})}
			</div>

			{/* Legend */}
			<div className="flex justify-center gap-6 text-sm">
				<div className="flex items-center gap-2">
					<div className="w-3 h-3 bg-primary rounded"></div>
					<span className="text-base-content/70">Focus Time (hours)</span>
				</div>
				<div className="flex items-center gap-2">
					<div className="w-3 h-3 bg-secondary rounded"></div>
					<span className="text-base-content/70">Sessions Count</span>
				</div>
			</div>

			{/* Summary Stats */}
			<div className="grid grid-cols-3 gap-4 pt-4 border-t border-base-200">
				<div className="text-center">
					<div className="text-lg font-semibold text-base-content">
						{dailyStats.reduce((acc, day) => acc + day.totalTime, 0).toFixed(1)}
						h
					</div>
					<div className="text-xs text-base-content/60">Total Time</div>
				</div>
				<div className="text-center">
					<div className="text-lg font-semibold text-base-content">
						{dailyStats.reduce((acc, day) => acc + day.sessions, 0)}
					</div>
					<div className="text-xs text-base-content/60">Total Sessions</div>
				</div>
				<div className="text-center">
					<div className="text-lg font-semibold text-base-content">
						{(
							dailyStats.reduce((acc, day) => acc + day.avgQuality, 0) /
							dailyStats.length
						).toFixed(1)}
					</div>
					<div className="text-xs text-base-content/60">Avg Quality</div>
				</div>
			</div>
		</div>
	);
};

export default ProductivityChart;
