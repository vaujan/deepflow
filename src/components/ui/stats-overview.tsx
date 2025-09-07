"use client";

import React, { useMemo } from "react";
import { Clock, Target, TrendingUp, Award } from "lucide-react";
import { mockSessions } from "../../data/mockSessions";
import { markCurrentScopeAsDynamic } from "next/dist/server/app-render/dynamic-rendering";
import HighlightedMultipleBar from "./highlighted-multiple-bar";

interface StatCardProps {
	title: string;
	value: string;
	subtitle: string;
	icon: React.ComponentType<{ className?: string }>;
	trend?: {
		value: string;
		isPositive: boolean;
	};
	chart?: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({
	title,
	value,
	subtitle,
	icon: Icon,
	trend,
	chart,
}) => {
	return (
		<div className="card border border-border w-full transition-all ease-out bg-card p-2">
			<div className="h-full flex justify-between">
				<div className="flex flex-col w-full gap-4">
					{/* Data & informations */}
					<div className="flex flex-col gap-2 p-2 h-fit">
						<p className="text-sm text-medium text-base-content/60">{title}</p>
						<p className="text-2xl font-medium text-base-content font-mono">
							{value}
						</p>
						<p className="text-xs text-base-content/50">{subtitle}</p>
						{trend && (
							<div
								className={`flex items-center gap-1 text-xs ${
									trend.isPositive ? "text-success" : "text-error"
								}`}
							>
								<TrendingUp
									className={`size-3 ${!trend.isPositive ? "rotate-180" : ""}`}
								/>
								<span>{trend.value}</span>
							</div>
						)}
					</div>

					<div className="w-full h-full bg-gray-4/50 pt-6 rounded-box">
						{chart ? (
							chart
						) : (
							<span className="text-gray-8 font-medium">chart</span>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

const calculateStats = () => {
	const totalSessions = mockSessions.length;
	const totalTime = mockSessions.reduce(
		(acc, session) => acc + session.elapsedTime,
		0
	);
	const avgQuality =
		mockSessions.reduce(
			(acc, session) => acc + (session.deepWorkQuality || 0),
			0
		) / totalSessions;
	const completedSessions = mockSessions.filter(
		(s) => s.completionType === "completed"
	).length;

	// Calculate time in hours and minutes
	const totalHours = Math.floor(totalTime / 3600);
	const totalMinutes = Math.floor((totalTime % 3600) / 60);

	// Calculate completion rate
	const completionRate =
		totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0;

	// Calculate average session duration
	const avgDuration = totalSessions > 0 ? totalTime / totalSessions / 60 : 0; // in minutes

	return {
		totalSessions,
		totalTime: `${totalHours}h ${totalMinutes}m`,
		avgQuality: avgQuality.toFixed(1),
		completionRate: completionRate.toFixed(1),
		avgDuration: avgDuration.toFixed(0),
	};
};

export default function StatsOverview() {
	const stats = calculateStats();

	return (
		<div className="w-full h-full">
			<div className="flex w-full gap-4">
				{/* Combined totals card: Total Sessions + Total Focus Time */}
				<div className="card border border-border w-full transition-all ease-out bg-card p-2">
					<div className="flex flex-col w-full gap-4">
						{/* Info header */}
						<div className="grid grid-cols-2 gap-4">
							<div className="flex p-4 border-r border-border flex-col gap-1">
								<p className="text-sm text-medium text-base-content/60">
									Total Sessions
								</p>
								<p className="text-2xl font-medium text-base-content font-mono">
									{stats.totalSessions}
								</p>
								<p className="text-xs text-base-content/50">Last 30 days</p>
							</div>
							<div className="flex flex-col p-4 gap-1">
								<p className="text-sm text-medium text-base-content/60">
									Total Focus Time
								</p>
								<p className="text-2xl font-medium text-base-content font-mono">
									{stats.totalTime}
								</p>
								<p className="text-xs text-base-content/50">Deep work hours</p>
							</div>
						</div>
						<div className="w-full min-h-48 bg-gray-4/50 pt-4 rounded-box">
							<HighlightedMultipleBar days={14} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
