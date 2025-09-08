"use client";

import React, { useMemo } from "react";
import { Check, Circle, Flame } from "lucide-react";
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
							<div className="flex gap-4">
								<div className="flex gap-4 items-center border-r-1 border-border w-full p-4 h-fit">
									<div className="flex flex-col gap-1">
										<p className="text-sm text-medium text-base-content/60">
											Daily Streak
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

									{/* Icon - only show if there are daily streaks */}
									{streaks.currentStreakDays > 0 && (
										<div className="bg-accent/20 size-8 flex justify-center items-center rounded-sm">
											<Flame className="size-4 text-accent animate-pulse" />
										</div>
									)}
								</div>

								<div className="flex gap-4 items-center w-full p-4 h-fit">
									<div className="flex flex-col gap-1">
										<p className="text-sm text-medium text-base-content/60">
											Weekly Streak
										</p>
										<p className="text-2xl font-medium text-base-content font-mono">
											{streaks.currentStreakWeeks}{" "}
											{streaks.currentStreakWeeks === 1 ? "week" : "weeks"}
										</p>
										<p className="text-xs text-base-content/50">
											Longest: {streaks.longestStreakWeeks}{" "}
											{streaks.longestStreakWeeks === 1 ? "week" : "weeks"}
										</p>
									</div>

									{/* Icon - only show if there are weekly streaks */}
									{streaks.currentStreakWeeks > 0 && (
										<div className="bg-accent/20 size-8 flex justify-center items-center rounded-sm">
											<Flame className="size-4 text-accent animate-pulse" />
										</div>
									)}
								</div>
							</div>

							{/* Weekly Activity Grid */}
							<div className="bg-base-100 border border-border relative rounded-box flex p-4 justify-center items-center gap-3 overflow-x-auto">
								<span className="text-xs invisible md:visible absolute left-2 top-2 badge badge-neutral badge-soft font-medium text-base-content/70">
									Week{" "}
									{Math.ceil(
										(new Date().getTime() -
											new Date(new Date().getFullYear(), 0, 1).getTime()) /
											(7 * 24 * 60 * 60 * 1000)
									)}
								</span>
								{weekActivity.map((isActive, idx) => {
									const today = new Date();
									const currentDayOfWeek = (today.getDay() + 6) % 7; // Convert to Mon=0..Sun=6
									const isToday = idx === currentDayOfWeek;
									const isFuture = idx > currentDayOfWeek;

									return (
										<div
											key={idx}
											className="flex flex-col items-center gap-1 min-w-10"
										>
											<div
												className={`size-7 rounded-full grid place-items-center border relative ${
													isActive
														? "border-transparent bg-orange-10"
														: "border-border"
												} ${
													isToday ? "ring-2 ring-orange-12 ring-offset-1" : ""
												} ${isFuture ? "opacity-50" : ""} 

												`}
											>
												{isActive ? (
													<Check className="size-4 text-white" />
												) : isFuture ? (
													<Circle className="size-4 text-base-content/20" />
												) : (
													<Circle className="size-4 text-base-content/30" />
												)}
												{isToday && (
													<div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full"></div>
												)}
											</div>
											<span
												className={`text-xs ${
													isToday
														? "text-orange-500 font-semibold"
														: isFuture
														? "text-base-content/40"
														: "text-base-content/60"
												}`}
											>
												{dayLabels[idx]}
											</span>
										</div>
									);
								})}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
