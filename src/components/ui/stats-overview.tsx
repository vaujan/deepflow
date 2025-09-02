"use client";

import React from "react";
import { Clock, Target, TrendingUp, Award } from "lucide-react";
import { mockSessions } from "../../data/mockSessions";

interface StatCardProps {
	title: string;
	value: string;
	subtitle: string;
	icon: React.ComponentType<{ className?: string }>;
	trend?: {
		value: string;
		isPositive: boolean;
	};
}

const StatCard: React.FC<StatCardProps> = ({
	title,
	value,
	subtitle,
	icon: Icon,
	trend,
}) => {
	return (
		<div className="card bg-base-100 p-6">
			<div className="card-body p-0">
				<div className="flex items-center justify-between">
					<div className="flex flex-col gap-2">
						<p className="text-sm text-base-content/60">{title}</p>
						<p className="text-2xl font-bold text-base-content">{value}</p>
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
					<div className="p-3 rounded-full bg-primary/10">
						<Icon className="size-6 text-primary" />
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
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
			<StatCard
				title="Total Sessions"
				value={stats.totalSessions.toString()}
				subtitle="Last 30 days"
				icon={Target}
				trend={{ value: "+12%", isPositive: true }}
			/>
			<StatCard
				title="Total Focus Time"
				value={stats.totalTime}
				subtitle="Deep work hours"
				icon={Clock}
				trend={{ value: "+8%", isPositive: true }}
			/>
			<StatCard
				title="Avg Quality"
				value={`${stats.avgQuality}/10`}
				subtitle="Focus rating"
				icon={Award}
				trend={{ value: "+0.3", isPositive: true }}
			/>
			<StatCard
				title="Completion Rate"
				value={`${stats.completionRate}%`}
				subtitle="Sessions finished"
				icon={TrendingUp}
				trend={{ value: "+5%", isPositive: true }}
			/>
		</div>
	);
}
