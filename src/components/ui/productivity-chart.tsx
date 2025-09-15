"use client";

import React from "react";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	CartesianGrid,
} from "recharts";
import type { TooltipProps } from "recharts";
import { mockSessions } from "../../data/mockSessions";
import { radixColorScales } from "../../utils/radixColorMapping";

const colors = {
	focus: radixColorScales.blue.blue9,
	text: radixColorScales.slate.slate12,
	grid: radixColorScales.slate.slate6,
};

const CustomTooltip: React.FC<TooltipProps<number, string>> = ({
	active,
	payload,
	label,
}) => {
	if (!active || !payload || payload.length === 0) return null;
	const hours = Number(payload[0]?.value ?? 0);
	return (
		<div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm shadow-lg">
			<div className="font-semibold text-gray-900 dark:text-gray-100">
				{label}
			</div>
			<div className="mt-1 flex items-center gap-2">
				<span
					className="inline-block size-2 rounded-full bg-blue-500"
					style={{ backgroundColor: colors.focus }}
				/>
				<span className="text-gray-600 dark:text-gray-400">Focus Time:</span>
				<span className="font-mono text-gray-900 dark:text-gray-100">
					{hours.toFixed(1)}h
				</span>
			</div>
		</div>
	);
};

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

		return {
			day: day.toLocaleDateString("en-US", { weekday: "short" }),
			date: day.getDate(),
			totalTime: totalTime / 3600, // Convert to hours
		};
	});

	return (
		<div className="space-y-4">
			{/* Chart */}
			<div className="h-48 bg-base-200 rounded-lg p-4">
				<ResponsiveContainer width="100%" height="100%">
					<LineChart data={dailyStats}>
						<CartesianGrid
							strokeDasharray="3 3"
							className="stroke-slate-300 dark:stroke-slate-600"
							opacity={0.3}
						/>
						<XAxis
							dataKey="day"
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							className="text-slate-600 dark:text-slate-400 text-xs"
							tick={{ fill: "currentColor", fontSize: 12 }}
						/>
						<YAxis
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							className="text-slate-600 dark:text-slate-400 text-xs"
							tick={{ fill: "currentColor", fontSize: 12 }}
						/>
						<Tooltip
							content={<CustomTooltip />}
							cursor={{
								stroke: colors.text,
								strokeWidth: 1,
								strokeOpacity: 0.3,
								strokeDasharray: "4 4",
							}}
						/>
						<Line
							type="linear"
							dataKey="totalTime"
							stroke={colors.focus}
							strokeWidth={3}
							strokeDasharray="5 5"
							dot={{ fill: colors.focus, strokeWidth: 2, r: 4 }}
							activeDot={{ r: 6, stroke: colors.focus, strokeWidth: 2 }}
						/>
					</LineChart>
				</ResponsiveContainer>
			</div>

			{/* Summary Stats */}
			<div className="grid grid-cols-1 gap-4 pt-4 border-t border-base-200">
				<div className="text-center">
					<div className="text-lg font-semibold text-base-content">
						{dailyStats.reduce((acc, day) => acc + day.totalTime, 0).toFixed(1)}
						h
					</div>
					<div className="text-xs text-base-content/60">Total Focus Time</div>
				</div>
			</div>
		</div>
	);
};

export default ProductivityChart;
