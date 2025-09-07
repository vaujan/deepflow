"use client";

import React, { useMemo, useState } from "react";
import {
	BarChart,
	Bar,
	XAxis,
	Cell,
	Tooltip,
	ResponsiveContainer,
} from "recharts";
import type { TooltipProps } from "recharts";
import { mockSessions } from "../../data/mockSessions";
import { radixColorScales } from "../../utils/radixColorMapping";

interface HighlightedMultipleBarProps {
	className?: string;
	days?: number;
}

type ChartPoint = {
	label: string;
	sessions: number;
	minutes: number;
};

const colors = {
	sessions: radixColorScales.blue.blue9,
	minutes: radixColorScales.cyan.cyan9,
	text: radixColorScales.slate.slate12,
};

const buildDailyData = (days: number): ChartPoint[] => {
	const today = new Date();
	const points: ChartPoint[] = [];
	for (let i = days - 1; i >= 0; i--) {
		const day = new Date(today);
		day.setDate(day.getDate() - i);
		const start = new Date(day);
		start.setHours(0, 0, 0, 0);
		const end = new Date(day);
		end.setHours(23, 59, 59, 999);

		const sessions = mockSessions.filter(
			(s) => s.startTime >= start && s.startTime <= end
		);
		const totalMinutes = Math.round(
			sessions.reduce((acc, s) => acc + (s.elapsedTime || 0), 0) / 60
		);

		points.push({
			label: day.toLocaleDateString("en-US", {
				month: "short",
				day: "numeric",
			}),
			sessions: sessions.length,
			minutes: totalMinutes,
		});
	}
	return points;
};

const DottedBackgroundPattern: React.FC<{ id: string }> = ({ id }) => {
	return (
		<pattern
			id={id}
			x="0"
			y="0"
			width="10"
			height="10"
			patternUnits="userSpaceOnUse"
		>
			<circle
				className="dark:text-base-content/20 text-base-content/10"
				cx="2"
				cy="2"
				r="1"
				fill="currentColor"
			/>
		</pattern>
	);
};

const CustomTooltip: React.FC<TooltipProps<number, string>> = ({
	active,
	payload,
	label,
}) => {
	if (!active || !payload || payload.length === 0) return null;
	const sessions = Number(
		payload.find((p) => p.dataKey === "sessions")?.value ?? 0
	);
	const minutes = Number(
		payload.find((p) => p.dataKey === "minutes")?.value ?? 0
	);
	return (
		<div className="rounded-md border border-border bg-card px-2 py-1 text-xs shadow-sm">
			<div className="font-medium text-base-content/80">{label}</div>
			<div className="mt-1 flex gap-3">
				<span className="flex items-center gap-1">
					<span
						className="inline-block size-2 rounded-sm"
						style={{ backgroundColor: colors.sessions }}
					/>
					<span className="text-base-content/70">Sessions:</span>
					<span className="font-mono text-base-content">{sessions}</span>
				</span>
				<span className="flex items-center gap-1">
					<span
						className="inline-block size-2 rounded-sm"
						style={{ backgroundColor: colors.minutes }}
					/>
					<span className="text-base-content/70">Focus:</span>
					<span className="font-mono text-base-content">{minutes}m</span>
				</span>
			</div>
		</div>
	);
};

const HighlightedMultipleBar: React.FC<HighlightedMultipleBarProps> = ({
	className = "",
	days = 14,
}) => {
	const data = useMemo(() => buildDailyData(days), [days]);
	const [activeIndex, setActiveIndex] = useState<number | null>(null);
	const patternId = useMemo(
		() => `hl-multi-pattern-${Math.random().toString(36).slice(2, 8)}`,
		[]
	);

	return (
		<div className={`w-full h-full ${className}`}>
			<ResponsiveContainer width="100%" height="100%">
				<BarChart
					data={data}
					onMouseLeave={() => setActiveIndex(null)}
					margin={{ top: 8, right: 8, left: 8, bottom: 0 }}
				>
					<rect
						x="0"
						y="0"
						width="100%"
						height="85%"
						fill={`url(#${patternId})`}
					/>
					<defs>
						<DottedBackgroundPattern id={patternId} />
					</defs>
					<XAxis
						dataKey="label"
						tickLine={false}
						axisLine={false}
						tickMargin={8}
						stroke={colors.text}
					/>
					<Tooltip content={<CustomTooltip />} cursor={false} />
					<Bar dataKey="sessions" radius={3} fill={colors.sessions}>
						{data.map((_, index) => (
							<Cell
								key={`cell-s-${index}`}
								fillOpacity={
									activeIndex === null ? 1 : activeIndex === index ? 1 : 0.35
								}
								stroke={activeIndex === index ? colors.sessions : undefined}
								onMouseEnter={() => setActiveIndex(index)}
								className="duration-200"
							/>
						))}
					</Bar>
					<Bar dataKey="minutes" radius={3} fill={colors.minutes}>
						{data.map((_, index) => (
							<Cell
								key={`cell-m-${index}`}
								fillOpacity={
									activeIndex === null ? 1 : activeIndex === index ? 1 : 0.35
								}
								stroke={activeIndex === index ? colors.minutes : undefined}
								onMouseEnter={() => setActiveIndex(index)}
								className="duration-200"
							/>
						))}
					</Bar>
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
};

export default HighlightedMultipleBar;
