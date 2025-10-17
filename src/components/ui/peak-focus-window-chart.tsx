"use client";

import React, { useMemo } from "react";
import { useStatsSessions } from "@/src/hooks/useStatsSessions";
import {
	computeHourlyFocus,
	findPeakWindow,
	getDateRangeSessions,
	Period,
} from "../../lib/analytics";
import { ResponsiveContainer, XAxis, YAxis, BarChart, Bar } from "recharts";
import { radixColorScales } from "../../utils/radixColorMapping";

interface PeakFocusWindowChartProps {
	className?: string;
	period?: Period;
	windowHours?: number; // highlight best N-hour window
}

const colors = {
	primary: radixColorScales.blue.blue9,
	primaryLine: radixColorScales.blue.blue10,
	accent: radixColorScales.cyan.cyan9,
	grid: radixColorScales.slate.slate5,
	text: radixColorScales.slate.slate12,
	highlight: radixColorScales.orange.orange9,
};

const formatHour = (h: number) => `${h}:00`;

const hexToRgb = (hex: string) => {
	const normalized = hex.replace("#", "");
	const bigint = parseInt(normalized, 16);
	const r = (bigint >> 16) & 255;
	const g = (bigint >> 8) & 255;
	const b = bigint & 255;
	return { r, g, b };
};

const PeakFocusWindowChart: React.FC<PeakFocusWindowChartProps> = ({
	className = "",
	period = "30d",
	windowHours = 3,
}) => {
	const fromIso = useMemo(() => {
		const now = new Date();
		const start = new Date(now);
		start.setHours(0, 0, 0, 0);
		if (period === "7d") start.setDate(start.getDate() - 6);
		else start.setDate(start.getDate() - 29);
		return start.toISOString();
	}, [period]);
	const { data: savedSessions = [] } = useStatsSessions({ from: fromIso });
	const { hourly, best } = useMemo(() => {
		const range = getDateRangeSessions(savedSessions, period);
		const hourly = computeHourlyFocus(range);
		const best = findPeakWindow(hourly, windowHours);
		return { hourly, best };
	}, [period, windowHours, savedSessions]);

	const highlighted = new Set<number>();
	for (let h = best.startHour; h <= best.endHour; h++) highlighted.add(h);

	// Build weekday (Mon-Sun) × hour (0-23) grid of total minutes
	const { grid, maxCellMinutes, mostActiveDayIdx, mostActiveDayMinutes } =
		useMemo(() => {
			const range = getDateRangeSessions(savedSessions, period);
			const g: number[][] = Array.from({ length: 7 }, () =>
				Array.from({ length: 24 }, () => 0)
			);
			for (const s of range) {
				const weekday = (s.startTime.getDay() + 6) % 7; // Mon=0..Sun=6
				const hour = s.startTime.getHours();
				g[weekday][hour] += Math.round((s.elapsedTime || 0) / 60);
			}
			let maxVal = 0;
			for (const row of g) for (const v of row) maxVal = Math.max(maxVal, v);
			const dayTotals = g.map((row) => row.reduce((a, b) => a + b, 0));
			let mai = 0;
			for (let i = 1; i < dayTotals.length; i++)
				if (dayTotals[i] > dayTotals[mai]) mai = i;
			return {
				grid: g,
				maxCellMinutes: maxVal,
				mostActiveDayIdx: mai,
				mostActiveDayMinutes: dayTotals[mai],
			};
		}, [period, savedSessions]);

	const weekdayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
	const hourLabels = Array.from({ length: 24 }, (_, h) => h);

	// Single primary color with alpha depth
	const baseRgb = hexToRgb(colors.primary);
	const colorForMinutes = (minutes: number) => {
		if (maxCellMinutes <= 0)
			return `rgba(${baseRgb.r}, ${baseRgb.g}, ${baseRgb.b}, 0.06)`;
		if (minutes <= 0)
			return `rgba(${baseRgb.r}, ${baseRgb.g}, ${baseRgb.b}, 0.06)`;
		const ratio = Math.max(0, Math.min(1, minutes / maxCellMinutes));
		const minA = 0.12;
		const maxA = 0.95;
		const alpha = minA + ratio * (maxA - minA);
		return `rgba(${baseRgb.r}, ${baseRgb.g}, ${baseRgb.b}, ${alpha.toFixed(
			3
		)})`;
	};

	return (
		<div
			className={`card border border-border w-full transition-all ease-out bg-card p-2 ${className}`}
		>
			<div className="flex flex-col w-full gap-4">
				<div className="grid grid-cols-2 gap-4">
					{/* Left: Peak window info */}
					<div className="flex flex-col border-r border-border p-4 gap-1">
						<p className="text-sm text-medium text-base-content/60">
							Peak Focus Window
						</p>
						<p className="text-2xl font-medium text-base-content font-mono">
							{formatHour(best.startHour)}–{formatHour(best.endHour + 1)}
						</p>
						<p className="text-xs text-base-content/50">
							Best {windowHours}h window
						</p>
					</div>
					{/* Right: Most active day, positioned like Tag Diversity */}
					<div className="flex p-4 flex-col gap-1">
						<p className="text-sm text-medium text-base-content/60">
							Most Active Day
						</p>
						<p className="text-2xl font-medium text-base-content font-mono">
							{weekdayLabels[mostActiveDayIdx]}
						</p>
						<p className="text-xs text-base-content/50">
							Total focus: {mostActiveDayMinutes}m
						</p>
					</div>
				</div>

				<div className="w-full">
					<div className="bg-base-100 border border-border rounded-box p-3 animate-in fade-in duration-500">
						{/* Heatmap: 7 rows (Mon..Sun) × 24 cols (0..23) */}
						<div className="flex flex-col gap-2">
							{/* X-axis hour labels (every 3 hours, emphasize 0:00 & 12:00) */}
							<div className="flex items-center gap-2">
								<div className="w-8" />
								<div
									className="grid gap-[2px] flex-1"
									style={{ gridTemplateColumns: "repeat(24, minmax(0, 1fr))" }}
								>
									{hourLabels.map((h) => {
										const show = h % 3 === 0;
										const strong = h === 0 || h === 12;
										return (
											<div
												key={h}
												className={`h-3 text-[10px] text-center ${
													strong
														? "text-base-content font-semibold"
														: "text-base-content/60"
												}`}
											>
												{show ? formatHour(h) : ""}
											</div>
										);
									})}
								</div>
							</div>
							{grid.map((row, rIdx) => (
								<div key={rIdx} className="flex items-center gap-2">
									<div className="w-8 text-xs text-base-content/60 text-right pr-1">
										{weekdayLabels[rIdx]}
									</div>
									<div
										className="grid flex-1"
										style={{
											gridTemplateColumns: "repeat(24, minmax(0, 1fr))",
										}}
									>
										{row.map((minutes, hourIdx) => {
											const isHl = highlighted.has(hourIdx);
											const bg = colorForMinutes(minutes);
											return (
												<div
													key={hourIdx}
													className={`relative transition-all duration-200 group ${
														minutes > 0
															? "hover:brightness-110 hover:ring-2 ring-primary"
															: "opacity-40"
													} ${
														isHl
															? "h-4 brightness-110 saturate-125 scale-y-110"
															: "h-4"
													}`}
													style={{ backgroundColor: bg }}
												>
													{/* Tooltip */}
													<div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 rounded-md border border-border bg-card px-3 py-2 text-xs shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 min-w-max">
														<div className="font-medium text-base-content/80">
															{weekdayLabels[rIdx]} {formatHour(hourIdx)}
														</div>
														<div className="mt-1 flex items-center gap-2">
															<span className="inline-block size-2 rounded-sm bg-primary" />
															<span className="text-base-content/70">
																Focus Time:
															</span>
															<span className="font-mono text-base-content">
																{minutes}m
															</span>
														</div>
													</div>
												</div>
											);
										})}
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PeakFocusWindowChart;
