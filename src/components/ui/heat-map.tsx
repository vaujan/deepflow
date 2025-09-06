"use client";

import React, { useState, useMemo } from "react";
import { mockSessions } from "../../data/mockSessions";
import { ChevronLeft, ChevronRight, Pin } from "lucide-react";

interface HeatMapDay {
	date: Date;
	value: number; // 0-4 for activity levels
	sessions: number;
	totalTime: number; // in minutes
}

interface HeatMapProps {
	className?: string;
}

const HeatMap: React.FC<HeatMapProps> = ({ className = "" }) => {
	const [currentMonth, setCurrentMonth] = useState(new Date());

	// Generate heat map data for the current month
	const heatMapData = useMemo(() => {
		const year = currentMonth.getFullYear();
		const month = currentMonth.getMonth();

		// Get first day of month and calculate starting date (Monday of first week)
		const firstDay = new Date(year, month, 1);
		const startDate = new Date(firstDay);
		startDate.setDate(firstDay.getDate() - ((firstDay.getDay() + 6) % 7)); // Start from Monday

		// Generate 42 days (6 weeks × 7 days)
		const days: HeatMapDay[] = [];
		for (let i = 0; i < 42; i++) {
			const date = new Date(startDate);
			date.setDate(startDate.getDate() + i);

			// Check if this date is in the current month
			const isCurrentMonth = date.getMonth() === month;

			if (isCurrentMonth) {
				// Calculate activity for this day
				const dayStart = new Date(date);
				dayStart.setHours(0, 0, 0, 0);
				const dayEnd = new Date(date);
				dayEnd.setHours(23, 59, 59, 999);

				const daySessions = mockSessions.filter(
					(session) =>
						session.startTime >= dayStart && session.startTime <= dayEnd
				);

				const totalTime =
					daySessions.reduce((acc, session) => acc + session.elapsedTime, 0) /
					60; // Convert to minutes

				// Calculate activity level (0-4)
				let value = 0;
				if (totalTime > 0) {
					if (totalTime < 30) value = 1;
					else if (totalTime < 60) value = 2;
					else if (totalTime < 120) value = 3;
					else value = 4;
				}

				days.push({
					date,
					value,
					sessions: daySessions.length,
					totalTime: Math.round(totalTime),
				});
			} else {
				// Empty day (not in current month)
				days.push({
					date,
					value: 0,
					sessions: 0,
					totalTime: 0,
				});
			}
		}

		return days;
	}, [currentMonth]);

	// Get color class based on activity level
	const getColorClass = (value: number) => {
		const colors = [
			"bg-base-200", // 0 - no activity
			"bg-primary/20", // 1 - low activity
			"bg-primary/40", // 2 - medium-low activity
			"bg-primary/60", // 3 - medium activity
			"bg-primary", // 4 - high activity
		];
		return colors[value] || colors[0];
	};

	// Navigation functions
	const goToPreviousMonth = () => {
		setCurrentMonth(
			(prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
		);
	};

	const goToNextMonth = () => {
		setCurrentMonth(
			(prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
		);
	};

	const goToToday = () => {
		setCurrentMonth(new Date());
	};

	// Check if we're currently viewing the current month
	const isCurrentMonthView =
		currentMonth.getMonth() === new Date().getMonth() &&
		currentMonth.getFullYear() === new Date().getFullYear();

	// Day labels
	const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

	return (
		<div className={`space-y-4 w-full ${className}`}>
			{/* Header with month navigation */}
			<div className="flex items-center justify-between">
				<div className="flex gap-4 items-center">
					<h3 className="text-lg font-semibold text-base-content">
						{currentMonth.toLocaleDateString("en-US", {
							month: "long",
							year: "numeric",
						})}
					</h3>

					{!isCurrentMonthView && (
						<button
							onClick={goToToday}
							className="btn btn-xs"
							aria-label="Go to current month"
						>
							<Pin className="size-3 text-base-content/50" />
							Today
						</button>
					)}
				</div>

				<div className="flex gap-2">
					<button
						onClick={goToPreviousMonth}
						className="btn btn-circle btn-sm"
						aria-label="Previous month"
					>
						<ChevronLeft className="size-4" />
					</button>
					<button
						onClick={goToNextMonth}
						className="btn btn-circle btn-sm"
						aria-label="Next month"
					>
						<ChevronRight className="size-4" />
					</button>
				</div>
			</div>

			{/* Heat map grid */}
			<div className="space-y-1">
				{/* Day labels */}
				<div className="grid grid-cols-7 gap-1 text-xs text-base-content/60 text-center">
					{dayLabels.map((day) => (
						<div key={day} className="py-1 rounded-sm bg-base-100">
							{day}
						</div>
					))}
				</div>

				{/* Calendar grid */}
				<div className="grid grid-cols-7 gap-1">
					{heatMapData.map((day, index) => {
						const isCurrentMonth =
							day.date.getMonth() === currentMonth.getMonth();
						const isToday =
							day.date.toDateString() === new Date().toDateString();

						return (
							<div
								key={index}
								className={`
                min-w-2 min-h-12 w-full h-full rounded-sm transition-all duration-200 hover:ring-2 ring-primary ease-out cursor-pointer
                ${getColorClass(day.value)}
                ${day.value === 0 ? "opacity-30" : ""}
                relative group flex items-center justify-center
              `}
								title={`${day.date.toLocaleDateString()} - ${
									day.sessions
								} sessions, ${day.totalTime}min`}
							>
								{/* Date number */}
								{isCurrentMonth && (
									<span
										className={`
										text-xs w-full h-full flex items-end p-1 relative
										${isToday ? "text-primary font-bold" : "text-base-content/80"}
										${day.value > 2 ? "text-white" : ""}
									`}
									>
										{day.date.getDate()}
										{/* Today indicator circle */}
										{isToday && (
											<div className="absolute top-1 right-1 w-1.5 h-1.5 bg-primary rounded-full"></div>
										)}
									</span>
								)}

								{/* Tooltip */}
								<div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-base-100 text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
									<div className="font-medium">
										{day.date.toLocaleDateString()}
									</div>
									<div>{day.sessions} sessions</div>
									<div>{day.totalTime}min total</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>

			{/* Yearly GitHub-style Heat Map */}
			<div className="overflow-x-auto lg:flex lg:justify-center border-1 p-2 border-border rounded-box lg:p-0 lg:border-0 lg:overflow-hidden">
				<YearlyHeatMap currentMonth={currentMonth} />
			</div>

			{/* Legend */}
			<div className="flex items-center justify-center gap-3 text-xs">
				<span className="text-base-content/60">Less</span>
				<div className="flex gap-0.5">
					{[0, 1, 2, 3, 4].map((level) => (
						<div
							key={level}
							className={`w-4 h-2 rounded-xs ${getColorClass(level)}`}
						/>
					))}
				</div>
				<span className="text-base-content/60">More</span>
			</div>
		</div>
	);
};

// Yearly GitHub-style Heat Map Component
const YearlyHeatMap: React.FC<{ currentMonth: Date }> = ({ currentMonth }) => {
	// Generate data for the entire year
	const yearlyData = useMemo(() => {
		const currentYear = new Date().getFullYear();
		const startDate = new Date(currentYear, 0, 1); // January 1st
		const endDate = new Date(currentYear, 11, 31); // December 31st

		// Calculate the start of the first week (Monday)
		const firstMonday = new Date(startDate);
		const dayOfWeek = (startDate.getDay() + 6) % 7; // Convert Sunday=0 to Monday=0
		firstMonday.setDate(startDate.getDate() - dayOfWeek);

		// Generate 53 weeks × 7 days = 371 days
		const days: HeatMapDay[] = [];
		for (let i = 0; i < 371; i++) {
			const date = new Date(firstMonday);
			date.setDate(firstMonday.getDate() + i);

			// Check if this date is within the current year
			const isCurrentYear = date.getFullYear() === currentYear;

			if (isCurrentYear) {
				// Calculate activity for this day
				const dayStart = new Date(date);
				dayStart.setHours(0, 0, 0, 0);
				const dayEnd = new Date(date);
				dayEnd.setHours(23, 59, 59, 999);

				const daySessions = mockSessions.filter(
					(session) =>
						session.startTime >= dayStart && session.startTime <= dayEnd
				);

				const totalTime =
					daySessions.reduce((acc, session) => acc + session.elapsedTime, 0) /
					60; // Convert to minutes

				// Calculate activity level (0-4)
				let value = 0;
				if (totalTime > 0) {
					if (totalTime < 15) value = 1;
					else if (totalTime < 30) value = 2;
					else if (totalTime < 60) value = 3;
					else value = 4;
				}

				days.push({
					date,
					value,
					sessions: daySessions.length,
					totalTime: Math.round(totalTime),
				});
			} else {
				// Empty day (not in current year)
				days.push({
					date,
					value: 0,
					sessions: 0,
					totalTime: 0,
				});
			}
		}

		return days;
	}, []);

	// Use the same color system as monthly calendar
	const getColorClass = (value: number) => {
		const colors = [
			"bg-base-200", // 0 - no activity
			"bg-primary/20", // 1 - low activity
			"bg-primary/40", // 2 - medium-low activity
			"bg-primary/60", // 3 - medium activity
			"bg-primary", // 4 - high activity
		];
		return colors[value] || colors[0];
	};

	// Group data by weeks
	const weeks = [];
	for (let i = 0; i < 53; i++) {
		const weekDays = yearlyData.slice(i * 7, (i + 1) * 7);
		weeks.push(weekDays);
	}

	// Month labels with highlighting for current month
	const monthLabels = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	];

	// Check which month is currently being viewed
	const currentViewedMonth = currentMonth.getMonth();

	return (
		<div className="space-y-3">
			{/* Heat map grid - responsive */}
			<div className="flex gap-1">
				<div className="flex p-1 gap-1 min-w-lg">
					{weeks.map((week, weekIndex) => (
						<div key={weekIndex} className="flex flex-col gap-1">
							{week.map((day, dayIndex) => {
								const isCurrentYear =
									day.date.getFullYear() === new Date().getFullYear();
								const isToday =
									day.date.toDateString() === new Date().toDateString();
								const isCurrentMonth =
									day.date.getMonth() === currentViewedMonth;

								return (
									<div
										key={dayIndex}
										className={`
											w-3 h-3 rounded-full transition-all duration-200 hover:scale-110 cursor-pointer
											${getColorClass(day.value)}
											${!isCurrentYear ? "opacity-0" : ""}
											${isToday ? "ring-2 ring-primary ring-offset-1" : ""}
											${isCurrentMonth ? "ring-1 ring-primary/50" : ""}
											relative group
										`}
										title={`${day.date.toLocaleDateString()} - ${
											day.sessions
										} sessions, ${day.totalTime}min`}
									>
										{/* Tooltip */}
										<div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-base-100 text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
											<div className="font-medium">
												{day.date.toLocaleDateString()}
											</div>
											<div>{day.sessions} sessions</div>
											<div>{day.totalTime}min total</div>
										</div>
									</div>
								);
							})}
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default HeatMap;
