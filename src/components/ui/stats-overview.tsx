"use client";

import React, { useMemo, useState } from "react";
import FocusTimeLineChart from "./highlighted-multiple-bar";
import { useStatsSessions } from "@/src/hooks/useStatsSessions";
// Tip removed per request

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
	// Simple range selector: 7, 14, 30, 90 (days)
	const [rangeDays, setRangeDays] = useState<number>(30);
	const fromIso = useMemo(() => {
		const now = new Date();
		const start = new Date(now);
		start.setHours(0, 0, 0, 0);
		start.setDate(start.getDate() - (rangeDays - 1));
		return start.toISOString();
	}, [rangeDays]);
	const { data: sessions = [] } = useStatsSessions({ from: fromIso });
	const stats = useMemo(() => calculateStats(sessions), [sessions]);

	// Tip logic removed

	return (
		<div className="w-full h-full">
			<div className="flex w-full h-full gap-4">
				{/* Combined totals card: Total Sessions + Total Focus Time */}
				<div className="card relative bg-card border-border border w-full transition-all ease-out p-2">
					<div className="flex flex-col w-full h-full  gap-4">
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
								<p className="text-xs text-base-content/50">
									Last {rangeDays} days
								</p>
							</div>
						</div>
						{/* Range selector (top-right) using daisyUI dropdown; label removed */}
						<div className="absolute top-2 right-2">
							<div className="dropdown dropdown-end">
								<button
									tabIndex={0}
									className="btn btn-md btn-ghost opacity-50 hover:opacity-100 transition-all ease-out"
									aria-label="Select time range"
									style={{ touchAction: "manipulation" }}
								>
									{rangeDays === 7 && "Last 7 days"}
									{rangeDays === 14 && "Last 14 days"}
									{rangeDays === 30 && "Last 30 days"}
									{rangeDays === 90 && "Last 90 days"}
								</button>
								<ul
									tabIndex={0}
									className="dropdown-content border border-base-200 z-[1] menu p-2 shadow bg-base-100 rounded-box w-40"
								>
									<li>
										<button
											onClick={() => setRangeDays(7)}
											className={`text-left text-xs ${
												rangeDays === 7 ? "bg-base-200" : ""
											}`}
										>
											Last 7 days
										</button>
									</li>
									<li>
										<button
											onClick={() => setRangeDays(14)}
											className={`text-left text-xs ${
												rangeDays === 14 ? "bg-base-200" : ""
											}`}
										>
											Last 14 days
										</button>
									</li>
									<li>
										<button
											onClick={() => setRangeDays(30)}
											className={`text-left text-xs ${
												rangeDays === 30 ? "bg-base-200" : ""
											}`}
										>
											Last 30 days
										</button>
									</li>
									<li>
										<button
											onClick={() => setRangeDays(90)}
											className={`text-left text-xs ${
												rangeDays === 90 ? "bg-base-200" : ""
											}`}
										>
											Last 90 days
										</button>
									</li>
								</ul>
							</div>
						</div>

						<div className="w-full min-h-48 h-full">
							<FocusTimeLineChart days={rangeDays} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
