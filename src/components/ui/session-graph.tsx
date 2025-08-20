"use client";

import React, { useState, useEffect } from "react";
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

export default function SessionGraph() {
	const [timeRange, setTimeRange] = useState<"week" | "month">("week");

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

	// Sample data for the last 7 days
	const weeklyData = [
		{ day: "Mon", duration: 150, focus: 8, quality: 9, sessions: 2 },
		{ day: "Tue", duration: 105, focus: 7, quality: 8, sessions: 1 },
		{ day: "Wed", duration: 195, focus: 9, quality: 10, sessions: 1 },
		{ day: "Thu", duration: 80, focus: 6, quality: 7, sessions: 1 },
		{ day: "Fri", duration: 165, focus: 8, quality: 8, sessions: 1 },
		{ day: "Sat", duration: 90, focus: 5, quality: 6, sessions: 1 },
		{ day: "Sun", duration: 120, focus: 7, quality: 8, sessions: 1 },
	];

	// Sample data for the last 4 weeks
	const monthlyData = [
		{ week: "Week 1", duration: 450, focus: 7.5, quality: 8.2, sessions: 6 },
		{ week: "Week 2", duration: 380, focus: 8.0, quality: 8.8, sessions: 5 },
		{ week: "Week 3", duration: 520, focus: 7.8, quality: 8.5, sessions: 7 },
		{ week: "Week 4", duration: 410, focus: 7.2, quality: 7.8, sessions: 5 },
	];

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
				{/* Duration & Focus Trend */}
				<div className="card bg-base-100 p-4">
					<h4 className="text-md font-medium mb-4">Duration & Focus Trend</h4>
					<ResponsiveContainer width="100%" height={250}>
						<LineChart data={timeRange === "week" ? weeklyData : monthlyData}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis
								dataKey={timeRange === "week" ? "day" : "week"}
								className="text-xs"
							/>
							<YAxis className="text-xs" />
							<Tooltip />
							<Legend />
							<Line
								type="monotone"
								dataKey="duration"
								stroke="#3b82f6"
								strokeWidth={2}
								name="Duration (min)"
							/>
							<Line
								type="monotone"
								dataKey="focus"
								stroke="#ef4444"
								strokeWidth={2}
								name="Focus Level"
							/>
						</LineChart>
					</ResponsiveContainer>
				</div>

				{/* Quality & Sessions */}
				<div className="card bg-base-100 p-4">
					<h4 className="text-md font-medium mb-4">Quality & Sessions</h4>
					<ResponsiveContainer width="100%" height={250}>
						<AreaChart data={timeRange === "week" ? weeklyData : monthlyData}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis
								dataKey={timeRange === "week" ? "day" : "week"}
								className="text-xs"
							/>
							<YAxis className="text-xs" />
							<Tooltip />
							<Legend />
							<Area
								type="monotone"
								dataKey="quality"
								stackId="1"
								stroke="#10b981"
								fill="#10b981"
								fillOpacity={0.6}
								name="Quality"
							/>
							<Area
								type="monotone"
								dataKey="sessions"
								stackId="2"
								stroke="#8b5cf6"
								fill="#8b5cf6"
								fillOpacity={0.6}
								name="Sessions"
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
					<calendar-date className="cally bg-base-100 border border-base-300 shadow-lg rounded-box">
						<svg
							aria-label="Previous"
							className="fill-current size-4"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							{...({ slot: "previous" } as any)}
						>
							<path fill="currentColor" d="M15.75 19.5 8.25 12l7.5-7.5"></path>
						</svg>
						<svg
							aria-label="Next"
							className="fill-current size-4"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							{...({ slot: "next" } as any)}
						>
							<path fill="currentColor" d="m8.25 4.5 7.5 7.5-7.5 7.5"></path>
						</svg>
						<calendar-month></calendar-month>
					</calendar-date>
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
