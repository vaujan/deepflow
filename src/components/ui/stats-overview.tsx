"use client";

import React, { useMemo } from "react";
import FocusTimeLineChart from "./highlighted-multiple-bar";
import { useSessionsQuery } from "@/src/hooks/useSessionsQuery";

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

const calculateStats = (
	sessions: Array<{
		elapsedTime: number;
		deepWorkQuality?: number;
		completionType?: string;
	}>
) => {
	const totalSessions = sessions.length;
	const totalTime = sessions.reduce((acc, s) => acc + (s.elapsedTime || 0), 0);
	const sumQuality = sessions.reduce(
		(acc, s) => acc + (s.deepWorkQuality || 0),
		0
	);
	const avgQuality = totalSessions > 0 ? sumQuality / totalSessions : 0;
	const completedSessions = sessions.filter(
		(s) => s.completionType === "completed"
	).length;
	const totalHours = Math.floor(totalTime / 3600);
	const totalMinutes = Math.floor((totalTime % 3600) / 60);
	const completionRate =
		totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0;
	const avgDuration = totalSessions > 0 ? totalTime / totalSessions / 60 : 0;
	return {
		totalSessions,
		totalTimeText: `${totalHours}h ${totalMinutes}m`,
		avgQualityText: avgQuality.toFixed(1),
		completionRateText: completionRate.toFixed(1),
		avgDurationText: avgDuration.toFixed(0),
	};
};

export default function StatsOverview() {
	const { data: sessions = [] } = useSessionsQuery();
	const stats = useMemo(() => calculateStats(sessions), [sessions]);

	return (
		<div className="w-full h-full">
			<div className="flex w-full gap-4">
				{/* Combined totals card: Total Sessions + Total Focus Time */}
				<div className="card bg-card border-border border w-full transition-all ease-out p-2">
					<div className="flex flex-col w-full gap-4">
						{/* Info header */}
						<div className="grid grid-cols-2 gap-4">
							{/* Card info */}
							<div className="flex flex-col border-r border-border p-4 gap-1">
								<p className="text-sm text-medium text-base-content/60">
									Total Focus Time
								</p>
								<p className="text-2xl font-medium text-base-content font-mono">
									{stats.totalTimeText}
								</p>
								<p className="text-xs text-base-content/50">Deep work hours</p>
							</div>

							<div className="flex p-4  flex-col gap-1">
								<p className="text-sm text-medium text-base-content/60">
									Total Sessions
								</p>
								<p className="text-2xl font-medium text-base-content font-mono">
									{stats.totalSessions}
								</p>
								<p className="text-xs text-base-content/50">Last 30 days</p>
							</div>
						</div>
						<div className="w-full min-h-48">
							<FocusTimeLineChart days={14} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
