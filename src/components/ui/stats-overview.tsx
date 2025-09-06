"use client";

import React, { useMemo } from "react";
import { Clock, Target, TrendingUp, Award } from "lucide-react";
import { mockSessions } from "../../data/mockSessions";
import { markCurrentScopeAsDynamic } from "next/dist/server/app-render/dynamic-rendering";
import SparklineRecharts from "./sparkline-recharts";
import { radixColorScales } from "../../utils/radixColorMapping";

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
		<div className="card w-full transition-all ease-out hover:bg-card p-2">
			<div className="h-full flex justify-between">
				<div className="flex flex-col w-full gap-4 justify-between">
					{/* Data & informations */}
					<div className="flex flex-col gap-2 p-2 h-full">
						<p className="text-sm `text-base-content/60">{title}</p>
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

					<div className="w-full bg-gray-2 border-border border pt-6 rounded-box h-32">
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

	const sparkData = useMemo(() => {
		// Build last 14 days total focus minutes
		const days = 14;
		const today = new Date();
		const arr: number[] = [];
		for (let i = days - 1; i >= 0; i--) {
			const day = new Date(today);
			day.setDate(day.getDate() - i);
			const start = new Date(day);
			start.setHours(0, 0, 0, 0);
			const end = new Date(day);
			end.setHours(23, 59, 59, 999);
			const total =
				mockSessions
					.filter((s) => s.startTime >= start && s.startTime <= end)
					.reduce((acc, s) => acc + (s.elapsedTime || 0), 0) / 60; // minutes
			arr.push(Math.round(total));
		}
		return arr;
	}, []);

	const primary = radixColorScales.blue.blue9;

	return (
		<div className="w-full">
			<div className="grid grid-cols-2 w-full gap-4">
				<StatCard
					title="Total Sessions"
					value={stats.totalSessions.toString()}
					subtitle="Last 30 days"
					icon={Target}
					trend={{ value: "+12%", isPositive: true }}
					chart={<SparklineRecharts data={sparkData} color={primary} />}
				/>
				<StatCard
					title="Total Focus Time"
					value={stats.totalTime}
					subtitle="Deep work hours"
					icon={Clock}
					trend={{ value: "+8%", isPositive: true }}
					chart={<SparklineRecharts data={sparkData} color={primary} />}
				/>
				<StatCard
					title="Avg Quality"
					value={`${stats.avgQuality}/10`}
					subtitle="Focus rating"
					icon={Award}
					trend={{ value: "+0.3", isPositive: true }}
					chart={<SparklineRecharts data={sparkData} color={primary} />}
				/>
				<StatCard
					title="Completion Rate"
					value={`${stats.completionRate}%`}
					subtitle="Sessions finished"
					icon={TrendingUp}
					trend={{ value: "+5%", isPositive: true }}
					chart={<SparklineRecharts data={sparkData} color={primary} />}
				/>
			</div>
		</div>
	);
}
