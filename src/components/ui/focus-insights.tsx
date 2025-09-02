"use client";

import React from "react";
import { Clock, Target, TrendingUp, Award, Zap, Calendar } from "lucide-react";
import { mockSessions } from "../../data/mockSessions";

interface InsightCardProps {
	title: string;
	value: string;
	description: string;
	icon: React.ComponentType<{ className?: string }>;
	color: "primary" | "secondary" | "accent" | "success" | "warning" | "error";
}

const InsightCard: React.FC<InsightCardProps> = ({
	title,
	value,
	description,
	icon: Icon,
	color,
}) => {
	const colorClasses = {
		primary: "bg-primary/10 text-primary",
		secondary: "bg-secondary/10 text-secondary",
		accent: "bg-accent/10 text-accent",
		success: "bg-success/10 text-success",
		warning: "bg-warning/10 text-warning",
		error: "bg-error/10 text-error",
	};

	return (
		<div className="flex items-start gap-3 p-4 bg-base-200/50 rounded-lg">
			<div className={`p-2 rounded-full ${colorClasses[color]}`}>
				<Icon className="size-4" />
			</div>
			<div className="flex-1">
				<h3 className="font-medium text-base-content">{title}</h3>
				<p className="text-lg font-bold text-base-content mt-1">{value}</p>
				<p className="text-sm text-base-content/60 mt-1">{description}</p>
			</div>
		</div>
	);
};

const calculateInsights = () => {
	// Best focus time (hour of day with highest quality sessions)
	const hourlyStats = Array.from({ length: 24 }, (_, hour) => {
		const hourSessions = mockSessions.filter(
			(session) => session.startTime.getHours() === hour
		);
		const avgQuality =
			hourSessions.length > 0
				? hourSessions.reduce(
						(acc, session) => acc + (session.deepWorkQuality || 0),
						0
				  ) / hourSessions.length
				: 0;
		return { hour, avgQuality, sessionCount: hourSessions.length };
	});

	const bestHour = hourlyStats.reduce((best, current) =>
		current.avgQuality > best.avgQuality ? current : best
	);

	// Most productive day of week
	const weeklyStats = Array.from({ length: 7 }, (_, day) => {
		const daySessions = mockSessions.filter(
			(session) => session.startTime.getDay() === day
		);
		const totalTime = daySessions.reduce(
			(acc, session) => acc + session.elapsedTime,
			0
		);
		return { day, totalTime, sessionCount: daySessions.length };
	});

	const mostProductiveDay = weeklyStats.reduce((best, current) =>
		current.totalTime > best.totalTime ? current : best
	);

	const dayNames = [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
	];

	// Average session duration
	const avgDuration =
		mockSessions.length > 0
			? mockSessions.reduce((acc, session) => acc + session.elapsedTime, 0) /
			  mockSessions.length /
			  60
			: 0;

	// Quality distribution
	const highQualitySessions = mockSessions.filter(
		(s) => (s.deepWorkQuality || 0) >= 8
	).length;
	const qualityRate =
		mockSessions.length > 0
			? (highQualitySessions / mockSessions.length) * 100
			: 0;

	// Streak calculation (consecutive days with sessions)
	let currentStreak = 0;
	let maxStreak = 0;
	const today = new Date();

	for (let i = 0; i < 30; i++) {
		const checkDate = new Date(today);
		checkDate.setDate(checkDate.getDate() - i);

		const dayStart = new Date(checkDate);
		dayStart.setHours(0, 0, 0, 0);
		const dayEnd = new Date(checkDate);
		dayEnd.setHours(23, 59, 59, 999);

		const hasSession = mockSessions.some(
			(session) => session.startTime >= dayStart && session.startTime <= dayEnd
		);

		if (hasSession) {
			if (i === 0) {
				currentStreak = 1;
			} else {
				currentStreak++;
			}
		} else {
			if (i > 0) {
				maxStreak = Math.max(maxStreak, currentStreak);
				currentStreak = 0;
			}
		}
	}

	maxStreak = Math.max(maxStreak, currentStreak);

	return {
		bestHour: bestHour.hour,
		bestHourQuality: bestHour.avgQuality.toFixed(1),
		mostProductiveDay: dayNames[mostProductiveDay.day],
		avgDuration: avgDuration.toFixed(0),
		qualityRate: qualityRate.toFixed(0),
		currentStreak,
		maxStreak,
	};
};

export default function FocusInsights() {
	const insights = calculateInsights();

	return (
		<div className="space-y-4">
			<InsightCard
				title="Peak Focus Time"
				value={`${insights.bestHour}:00`}
				description={`Your highest quality sessions happen at ${insights.bestHour}:00 (${insights.bestHourQuality}/10 avg)`}
				icon={Zap}
				color="primary"
			/>

			<InsightCard
				title="Most Productive Day"
				value={insights.mostProductiveDay}
				description="You complete the most deep work on this day of the week"
				icon={Calendar}
				color="secondary"
			/>

			<InsightCard
				title="Average Session"
				value={`${insights.avgDuration} min`}
				description="Your typical deep work session duration"
				icon={Clock}
				color="accent"
			/>

			<InsightCard
				title="High Quality Rate"
				value={`${insights.qualityRate}%`}
				description="Sessions rated 8+ out of 10"
				icon={Award}
				color="success"
			/>

			<InsightCard
				title="Current Streak"
				value={`${insights.currentStreak} days`}
				description={`Best streak: ${insights.maxStreak} days`}
				icon={TrendingUp}
				color="warning"
			/>
		</div>
	);
}
