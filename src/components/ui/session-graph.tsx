"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
	LineChart,
	Line,
	BarChart,
	Bar,
	PieChart,
	Pie,
	Cell,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
	AreaChart,
	Area,
} from "recharts";
import { useSessionsQuery } from "@/src/hooks/useSessionsQuery";
import { radixColorScales } from "../../utils/radixColorMapping";

// Declare custom elements for TypeScript
declare global {
	namespace JSX {
		interface IntrinsicElements {
			"calendar-date": React.DetailedHTMLProps<
				React.HTMLAttributes<HTMLElement> & { [key: string]: any },
				HTMLElement
			>;
			"calendar-month": React.DetailedHTMLProps<
				React.HTMLAttributes<HTMLElement> & { [key: string]: any },
				HTMLElement
			>;
		}
	}
}

const colors = {
	focus: radixColorScales.blue.blue9,
	text: radixColorScales.slate.slate12,
	grid: radixColorScales.slate.slate6,
};

export default function SessionGraph() {
	const [timeRange, setTimeRange] = useState<"week" | "month">("week");
	const { data: sessions = [] } = useSessionsQuery();

	// Load Cally web component
	useEffect(() => {
		const script = document.createElement("script");
		script.type = "module";
		script.src = "https://unpkg.com/cally";
		document.head.appendChild(script);

		return () => {
			document.head.removeChild(script);
		};
	}, []);

	// Generate real data from mockSessions
	const weeklyData = useMemo(() => {
		const days = [];
		const today = new Date();

		for (let i = 6; i >= 0; i--) {
			const date = new Date(today);
			date.setDate(date.getDate() - i);
			days.push(date);
		}

		return days.map((day) => {
			const dayStart = new Date(day);
			dayStart.setHours(0, 0, 0, 0);
			const dayEnd = new Date(day);
			dayEnd.setHours(23, 59, 59, 999);

			const daySessions = (sessions as any[]).filter((session) => {
				const start = new Date(session.startTime);
				return start >= dayStart && start <= dayEnd;
			});

			const totalTime = daySessions.reduce(
				(acc, session) => acc + session.elapsedTime,
				0
			);

			return {
				day: day.toLocaleDateString("en-US", { weekday: "short" }),
				focusTime: totalTime / 3600, // Convert to hours
			};
		});
	}, []);

	const monthlyData = useMemo(() => {
		const weeks = [];
		const today = new Date();

		for (let i = 3; i >= 0; i--) {
			const weekStart = new Date(today);
			weekStart.setDate(weekStart.getDate() - (i * 7 + 6));
			weeks.push(weekStart);
		}

		return weeks.map((weekStart, index) => {
			const weekEnd = new Date(weekStart);
			weekEnd.setDate(weekEnd.getDate() + 6);
			weekEnd.setHours(23, 59, 59, 999);

			const weekSessions = (sessions as any[]).filter((session) => {
				const start = new Date(session.startTime);
				return start >= weekStart && start <= weekEnd;
			});

			const totalTime = weekSessions.reduce(
				(acc, session) => acc + session.elapsedTime,
				0
			);

			return {
				week: `Week ${index + 1}`,
				focusTime: totalTime / 3600, // Convert to hours
			};
		});
	}, []);

	// Focus level distribution data
	const focusDistribution = [
		{ name: "Light (1-3)", value: 2, color: "#10b981" },
		{ name: "Moderate (4-7)", value: 4, color: "#f59e0b" },
		{ name: "Deep (8-10)", value: 4, color: "#ef4444" },
	];

	// Quality distribution data
	const qualityDistribution = [
		{ name: "Poor (1-5)", value: 1, color: "#ef4444" },
		{ name: "Good (6-7)", value: 3, color: "#f59e0b" },
		{ name: "Excellent (8-10)", value: 6, color: "#10b981" },
	];

	// Calendar data for the current month
	const generateCalendarData = () => {
		const today = new Date();
		const currentMonth = today.getMonth();
		const currentYear = today.getFullYear();
		const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

		const calendar = [];
		for (let day = 1; day <= daysInMonth; day++) {
			// Simulate some days with sessions
			const hasSessions = Math.random() > 0.4;
			const sessions = hasSessions ? Math.floor(Math.random() * 3) + 1 : 0;
			const duration = hasSessions ? Math.floor(Math.random() * 240) + 60 : 0;

			calendar.push({
				day,
				sessions,
				duration,
				date: new Date(currentYear, currentMonth, day),
			});
		}
		return calendar;
	};

	const calendarData = generateCalendarData();

	const getCalendarCellColor = (sessions: number, duration: number) => {
		if (sessions === 0) return "bg-base-200";
		if (duration < 120) return "bg-warning/20";
		if (duration < 180) return "bg-warning/40";
		if (duration < 240) return "bg-success/40";
		return "bg-success/60";
	};

	const getDurationLabel = (duration: number) => {
		if (duration < 120) return "Short";
		if (duration < 180) return "Medium";
		if (duration < 240) return "Long";
		return "Extended";
	};

	return (
		<div className="space-y-6">
			{/* Time Range Selector */}
			<div className="flex justify-between items-center">
				<h3 className="text-lg font-semibold">Deep Work Analytics</h3>
				<div className="tabs tabs-boxed">
					<button
						className={`tab ${timeRange === "week" ? "tab-active" : ""}`}
						onClick={() => setTimeRange("week")}
					>
						Weekly
					</button>
					<button
						className={`tab ${timeRange === "month" ? "tab-active" : ""}`}
						onClick={() => setTimeRange("month")}
					>
						Monthly
					</button>
				</div>
			</div>

			{/* Main Charts Row */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Focus Time Trend */}
				<div className="card bg-base-100 p-4">
					<h4 className="text-md font-medium mb-4">Focus Time Trend</h4>
					<ResponsiveContainer width="100%" height={250}>
						<LineChart data={timeRange === "week" ? weeklyData : monthlyData}>
							<CartesianGrid
								strokeDasharray="3 3"
								stroke={colors.grid}
								opacity={0.3}
							/>
							<XAxis
								dataKey={timeRange === "week" ? "day" : "week"}
								className="text-xs"
								stroke={colors.text}
							/>
							<YAxis className="text-xs" stroke={colors.text} />
							<Tooltip
								formatter={(value: any) => [
									`${value.toFixed(1)}h`,
									"Focus Time",
								]}
								labelFormatter={(label) => `${label}`}
							/>
							<Line
								type="linear"
								dataKey="focusTime"
								stroke={colors.focus}
								strokeWidth={3}
								strokeDasharray="5 5"
								dot={{ fill: colors.focus, strokeWidth: 2, r: 4 }}
								activeDot={{ r: 6, stroke: colors.focus, strokeWidth: 2 }}
							/>
						</LineChart>
					</ResponsiveContainer>
				</div>

				{/* Focus Time Distribution */}
				<div className="card bg-base-100 p-4">
					<h4 className="text-md font-medium mb-4">Focus Time Distribution</h4>
					<ResponsiveContainer width="100%" height={250}>
						<AreaChart data={timeRange === "week" ? weeklyData : monthlyData}>
							<CartesianGrid
								strokeDasharray="3 3"
								stroke={colors.grid}
								opacity={0.3}
							/>
							<XAxis
								dataKey={timeRange === "week" ? "day" : "week"}
								className="text-xs"
								stroke={colors.text}
							/>
							<YAxis className="text-xs" stroke={colors.text} />
							<Tooltip
								formatter={(value: any) => [
									`${value.toFixed(1)}h`,
									"Focus Time",
								]}
								labelFormatter={(label) => `${label}`}
							/>
							<Area
								type="linear"
								dataKey="focusTime"
								stroke={colors.focus}
								strokeDasharray="5 5"
								fill={colors.focus}
								fillOpacity={0.3}
							/>
						</AreaChart>
					</ResponsiveContainer>
				</div>
			</div>

			{/* Distribution Charts Row */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Focus Level Distribution */}
				<div className="card bg-base-100 p-4">
					<h4 className="text-md font-medium mb-4">Focus Level Distribution</h4>
					<ResponsiveContainer width="100%" height={200}>
						<PieChart>
							<Pie
								data={focusDistribution}
								cx="50%"
								cy="50%"
								innerRadius={40}
								outerRadius={80}
								paddingAngle={5}
								dataKey="value"
							>
								{focusDistribution.map((entry, index) => (
									<Cell key={`cell-${index}`} fill={entry.color} />
								))}
							</Pie>
							<Tooltip />
							<Legend />
						</PieChart>
					</ResponsiveContainer>
				</div>

				{/* Quality Distribution */}
				<div className="card bg-base-100 p-4">
					<h4 className="text-md font-medium mb-4">Quality Distribution</h4>
					<ResponsiveContainer width="100%" height={200}>
						<BarChart data={qualityDistribution}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="name" className="text-xs" />
							<YAxis className="text-xs" />
							<Tooltip />
							<Bar dataKey="value" fill="#8884d8" />
						</BarChart>
					</ResponsiveContainer>
				</div>
			</div>

			{/* Calendar View */}
			<div className="card bg-base-100 p-4">
				<h4 className="text-md font-medium mb-4">Monthly Deep Work Calendar</h4>
				<div className="flex justify-center">
					<div className="cally bg-base-100 border border-base-300 shadow-lg rounded-box p-4">
						<div className="flex items-center justify-between mb-4">
							<svg
								aria-label="Previous"
								className="fill-current size-4 cursor-pointer hover:opacity-70"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
							>
								<path
									fill="currentColor"
									d="M15.75 19.5 8.25 12l7.5-7.5"
								></path>
							</svg>
							<span className="text-lg font-medium">December 2024</span>
							<svg
								aria-label="Next"
								className="fill-current size-4 cursor-pointer hover:opacity-70"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
							>
								<path fill="currentColor" d="m8.25 4.5 7.5 7.5-7.5 7.5"></path>
							</svg>
						</div>
						<div className="text-center text-base-content/70">
							Calendar view coming soon...
						</div>
					</div>
				</div>

				{/* Legend */}
				<div className="flex flex-wrap gap-4 mt-4 text-xs justify-center">
					<div className="flex items-center gap-2">
						<div className="w-3 h-3 bg-base-200 rounded"></div>
						<span>No sessions</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-3 h-3 bg-warning/20 rounded"></div>
						<span>Short (&lt;2h)</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-3 h-3 bg-warning/40 rounded"></div>
						<span>Medium (2-3h)</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-3 h-3 bg-success/40 rounded"></div>
						<span>Long (3-4h)</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-3 h-3 bg-success/60 rounded"></div>
						<span>Extended (&gt;4h)</span>
					</div>
				</div>
			</div>
		</div>
	);
}
