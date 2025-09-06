"use client";

import React, { useMemo } from "react";
import { Flame, Check, Circle } from "lucide-react";
import { mockSessions } from "../../data/mockSessions";
import { computeStreaks } from "../../lib/analytics";
import { radixColorScales } from "../../utils/radixColorMapping";

interface FocusStreakProps {
	className?: string;
}

const accent = radixColorScales.orange.orange9;

const startOfIsoWeek = (date: Date) => {
	const d = new Date(date);
	d.setHours(0, 0, 0, 0);
	const day = (d.getDay() + 6) % 7; // Mon=0..Sun=6
	d.setDate(d.getDate() - day);
	return d;
};

export default function FocusStreak({ className = "" }: FocusStreakProps) {
	const streaks = useMemo(() => computeStreaks(mockSessions), []);

	// Build activity across the current ISO week (Mon..Sun)
	const weekActivity = useMemo(() => {
		const today = new Date();
		const start = startOfIsoWeek(today);
		const end = new Date(start);
		end.setDate(end.getDate() + 7);

		const active: boolean[] = Array.from({ length: 7 }, () => false);
		for (const s of mockSessions) {
			if (s.startTime >= start && s.startTime < end) {
				const idx = (s.startTime.getDay() + 6) % 7; // Mon=0..Sun=6
				active[idx] = true;
			}
		}
		return active;
	}, []);

	const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

	return (
		<div className={`w-full ${className}`}>
			<div className="flex w-full gap-4">
				{/* Current Streak Card */}
				<div className="card border border-border w-full transition-all ease-out bg-card p-2">
					<div className="h-full flex justify-between">
						<div className="flex flex-col w-full gap-4">
							{/* Data & informations */}
							<div className="flex flex-col gap-2 p-2 h-fit">
								<div className="flex items-center gap-2">
									<div className="flex flex-col gap-1">
										<p className="text-sm text-medium text-base-content/60">
											Current Streak
										</p>
										<p className="text-2xl font-medium text-base-content font-mono">
											{streaks.currentStreakDays}{" "}
											{streaks.currentStreakDays === 1 ? "day" : "days"}
										</p>
										<p className="text-xs text-base-content/50">
											Longest: {streaks.longestStreakDays}{" "}
											{streaks.longestStreakDays === 1 ? "day" : "days"}
										</p>
									</div>
								</div>
							</div>

							{/* Weekly Activity Grid */}
							<div className="dark:bg-gray-4/50 rounded-box flex p-4 items-center gap-3 overflow-x-auto">
								{weekActivity.map((isActive, idx) => (
									<div
										key={idx}
										className="flex flex-col items-center gap-1 min-w-10"
									>
										<div
											className={`size-7 rounded-full grid place-items-center border ${
												isActive ? "border-transparent" : "border-border"
											}`}
											style={{
												backgroundColor: isActive ? accent : "transparent",
											}}
										>
											{isActive ? (
												<Check className="size-4 text-white" />
											) : (
												<Circle className="size-4 text-base-content/30" />
											)}
										</div>
										<span className="text-xs text-base-content/60">
											{dayLabels[idx]}
										</span>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
